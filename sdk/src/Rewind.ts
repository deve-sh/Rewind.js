import { getSessionId } from "./utils/session";

import type { UserEvent } from "./types";
import call from "./utils/call";

class RewindJS {
	private isRecording = false;
	private canSendMoreAPICalls = true;

	private apiKey: string = "";
	private baseURL: string = process.env.SERVER_BASE_URL || "";

	private sessionId: string;

	private eventsQueue: UserEvent[] = [];

	constructor(initOptions: { baseURL?: string; apiKey: string }) {
		this.sessionId = getSessionId();

		if (!initOptions)
			throw new Error("[Rewind.js] API Key is required for initialization.");

		if (initOptions.baseURL) this.baseURL = initOptions.baseURL;
		if (initOptions.apiKey) this.apiKey = initOptions.apiKey;
	}

	public setUserProperties(properties: {
		email?: string;
		uid: string;
		name: string;
		metadata?: Record<string, any>;
	}) {}

	public startRecording() {
		this.isRecording = true;
		this.canSendMoreAPICalls = true;

		// TODO: Add Event listeners for DOM Mutations and Initial States
		// TODO: Add events flush to server
	}

	public pauseRecording() {
		this.isRecording = false;

		// TODO: Remove Event listeners for DOM Mutations and Initial States
		// TODO: Remove events flush to server
	}

	private async flushEventsToServer() {
		if (!this.canSendMoreAPICalls) return;

		if (!this.eventsQueue.length) return;

		const backupEventsQueue = this.eventsQueue;

		const constructedRequestBody = {
			events: JSON.stringify(this.eventsQueue),
			sessionId: this.sessionId,
		};
		const headers = {
			"x-api-key": this.apiKey,
			"content-type": "application/json",
		};

		const { error } = await call(
			this.baseURL + "/track",
			constructedRequestBody,
			headers
		);

		if (error) this.canSendMoreAPICalls = false;
	}
}

export default RewindJS;
