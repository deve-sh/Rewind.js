export type ScaffoldingEvent = {
	type: "scaffolding";
	html: string;
};

export type MouseMoveInteractionEvent = {
	type: "mousemove";
	x: number;
	y: number;
};

export type MouseClickEvent = {
	type: "mouseclick";
	x: number;
	y: number;
};

export type InputEvent = {
	type: "input";
	target: string;
	newValue: string;
};

export type DOMMutationEvent = {
	type: "mutation";
	subType: "attributes" | "characterData" | "childList";
	target: string;
	attributeName: string | null;
	oldValue: string | null;
	newValue: string | null;
	addedNodes: (string | null)[];
	removedNodes: (string | null)[];
};

export type UserEvent = { time: number } & (
	| ScaffoldingEvent
	| MouseMoveInteractionEvent
	| MouseClickEvent
	| InputEvent
	| DOMMutationEvent
);
