import { getSessionId } from "./utils/session";

import type { UserEvent } from "./types";

class RewindJS {
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

	public startRecording() {}

	public pauseRecording() {}

	private flushEventsToServer() {}

	private destroy() {}
}

export default RewindJS;
