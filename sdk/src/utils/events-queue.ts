import type { UserEvent } from "../types";

let eventsQueue: UserEvent[] = [];

export function getQueue() {
	return eventsQueue;
}

export function pushToQueue(event: UserEvent | UserEvent[]) {
	if (Array.isArray(event)) eventsQueue = [...eventsQueue, ...event];
	else eventsQueue.push(event);
}

export function setQueue(toSet: typeof eventsQueue) {
	eventsQueue = [...toSet];
}
