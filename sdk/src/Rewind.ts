import { getSessionId } from "./utils/session";

import { getQueue, pushToQueue } from "./utils/events-queue";

import call from "./utils/call";
import getElementPath from "./utils/get-element-path";

import type { DOMMutationEvent, UserEvent } from "./types";

class RewindJS {
	private canSendMoreAPICalls = true;

	private apiKey: string = "";
	private baseURL: string = process.env.SERVER_BASE_URL || "";

	public userProperties: {
		email?: string;
		name?: string;
		uid?: string;
	} | null = null;

	private sessionId: string;

	private mutationObservers: MutationObserver[] = [];
	private eventListeners: { event: string; listener: (args: any) => any }[] =
		[];
	private intervals: number[] = [];

	constructor(initOptions: { baseURL?: string; apiKey: string }) {
		this.sessionId = getSessionId();

		if (!initOptions)
			throw new Error("[Rewind.js] API Key is required for initialization.");

		if (initOptions.baseURL) this.baseURL = initOptions.baseURL;
		if (initOptions.apiKey) this.apiKey = initOptions.apiKey;

		this.setUserProperties = this.setUserProperties.bind(this);
		this.startRecording = this.startRecording.bind(this);
		this.pauseRecording = this.pauseRecording.bind(this);
		this.setupInitialHTML = this.setupInitialHTML.bind(this);
		this.listenToDOMMutationsAndInputs =
			this.listenToDOMMutationsAndInputs.bind(this);
		this.unregisterListeners = this.unregisterListeners.bind(this);
		this.flushEventsToServer = this.flushEventsToServer.bind(this);
	}

	public setUserProperties(properties: (typeof this)["userProperties"]) {
		if (!properties)
			return (this.userProperties = { uid: new Date().getTime().toString() });

		if (!properties.email && !properties.name && !properties.uid)
			throw new Error(
				"Incorrect use of RewindJS.setUserProperties: any one of name, email, uid is mandatory"
			);

		this.userProperties = properties;
	}

	public startRecording() {
		this.canSendMoreAPICalls = true;

		this.setupInitialHTML();
		this.listenToDOMMutationsAndInputs();
	}

	public pauseRecording() {
		this.unregisterListeners();
	}

	private setupInitialHTML() {
		const docClone = document.cloneNode(true) as Node & Document;

		// Remove all <script> tags from the cloned document
		docClone.querySelectorAll("script").forEach((el) => el.remove());

		// Remove all elements from <head> except <link> and <style>
		docClone
			.querySelectorAll("head > *:not(link):not(style)")
			.forEach((el) => el.remove());

		const initialScaffoldedHtml = `<!DOCTYPE html><html>${docClone.documentElement.innerHTML}</html>`;

		pushToQueue({
			type: "scaffolding",
			time: Date.now(),
			html: initialScaffoldedHtml,
		});
	}

	private listenToDOMMutationsAndInputs() {
		const headTarget = document.head;
		const bodyTarget = document.body;

		function serializeMutation(mutation: MutationRecord) {
			return {
				type: "mutation" as DOMMutationEvent["type"],
				subType: mutation.type as DOMMutationEvent["subType"],
				time: Date.now(),
				target: getElementPath(mutation.target as Node & Element),
				attributeName: mutation.attributeName || null,
				oldValue: mutation.oldValue || null,
				newValue:
					mutation.target.nodeValue || mutation.target.textContent || null,
				addedNodes: [...mutation.addedNodes].map(
					(node) => (node as Element).outerHTML || node.nodeValue
				),
				removedNodes: [...mutation.removedNodes].map(
					(node) => (node as Element).outerHTML || node.nodeValue
				),
			};
		}

		const headObserver = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				// Filter mutations to only include <link> and <style> tag changes
				if (
					mutation.target instanceof HTMLLinkElement ||
					mutation.target instanceof HTMLStyleElement ||
					[...mutation.addedNodes].some(
						(node) =>
							node instanceof HTMLLinkElement ||
							node instanceof HTMLStyleElement
					) ||
					[...mutation.removedNodes].some(
						(node) =>
							node instanceof HTMLLinkElement ||
							node instanceof HTMLStyleElement
					)
				) {
					pushToQueue(serializeMutation(mutation));
				}
			});
		});

		headObserver.observe(headTarget, {
			subtree: false,
			childList: true,
			attributes: true,
			characterData: true,
		});

		const bodyObserver = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				// Ignore mutations related to <script> tags
				if (
					mutation.target instanceof HTMLScriptElement ||
					[...mutation.addedNodes].some(
						(node) => node instanceof HTMLScriptElement
					) ||
					[...mutation.removedNodes].some(
						(node) => node instanceof HTMLScriptElement
					)
				)
					return;

				pushToQueue(serializeMutation(mutation));
			});
		});

		bodyObserver.observe(bodyTarget, {
			childList: true,
			subtree: true,
			attributes: true,
			characterData: true,
		});

		function inputsEventListener(event: Event) {
			const target = event.target as EventTarget as Element;

			if (!target) return;

			if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
				pushToQueue({
					type: "input",
					target: getElementPath(target),
					time: Date.now(),
					// @ts-ignore Can't get InputElement or TextAreaElement interfaces for some reason
					newValue: target.value,
				});
			}
		}

		let lastMouseMoveEvent: UserEvent | null = null;
		let throttlingMouseMoveEvents = false;

		function onMouseMove(event: MouseEvent) {
			lastMouseMoveEvent = {
				type: "mousemove",
				time: Date.now(),
				x: event.clientX,
				y: event.clientY,
			};

			if (!throttlingMouseMoveEvents) {
				throttlingMouseMoveEvents = true;

				setTimeout(() => {
					if (lastMouseMoveEvent) pushToQueue(lastMouseMoveEvent);
					throttlingMouseMoveEvents = false;
				}, 100);
			}
		}

		function onMouseClick(event: MouseEvent) {
			pushToQueue({
				type: "mouseclick",
				time: Date.now(),
				x: event.clientX,
				y: event.clientY,
			});
		}

		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("click", onMouseClick);
		document.addEventListener("input", inputsEventListener);

		this.intervals.push(window.setInterval(this.flushEventsToServer, 3500));
		this.mutationObservers.push(headObserver);
		this.mutationObservers.push(bodyObserver);
		this.eventListeners.push({ event: "input", listener: inputsEventListener });
		this.eventListeners.push({ event: "click", listener: onMouseClick });
		this.eventListeners.push({ event: "mousemove", listener: onMouseMove });
	}

	private unregisterListeners() {
		if (this.mutationObservers.length)
			this.mutationObservers.forEach((observer) => observer.disconnect());

		this.mutationObservers = [];

		if (this.eventListeners.length)
			this.eventListeners.forEach((listenerRegistration) =>
				document.removeEventListener(
					listenerRegistration.event,
					listenerRegistration.listener
				)
			);

		this.eventListeners = [];

		if (this.intervals)
			this.intervals.forEach((interval) => window.clearInterval(interval));

		this.intervals = [];
	}

	private async flushEventsToServer() {
		if (!this.canSendMoreAPICalls) return;

		if (!getQueue().length) return;

		const constructedRequestBody = {
			events: JSON.stringify(getQueue()),
			sessionId: this.sessionId,
			user: this.userProperties,
		};
		const headers = {
			"x-api-key": this.apiKey,
			"content-type": "application/json",
		};

		try {
			const endpoint = new URL("/events/track", this.baseURL).toString();

			const { error: apiCallError } = await call(
				endpoint,
				constructedRequestBody,
				headers
			);

			if (apiCallError) this.canSendMoreAPICalls = false;
		} catch {
			// Invalid Base URL or network issue
			this.canSendMoreAPICalls = false;
		}
	}
}

export default RewindJS;
