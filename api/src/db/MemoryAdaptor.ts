import type { Chunk, DBAdaptor } from "./types";

let sessions = new Map();

class MemoryAdaptor implements DBAdaptor {
	constructor() {}

	// @ts-expect-error To be implemented
	getSessionChunks(time: [string, string]): {
		error: Error | unknown;
		result: { chunks: Chunk[] };
	} {}

	// @ts-expect-error To be implemented
	getSessions(filters: Record<string, any>): {
		error: Error | unknown;
		result: {
			count: number;
			limit: number;
			offset: number;
			sessions: {
				id: string;
				user: { email?: string; uid?: string; name?: string };
			}[];
		};
	} {}

	// @ts-expect-error To be implemented
	deleteSession(id: string): {
		error: Error | unknown;
		result: { deleted: boolean };
	} {}

	createSession(session: {
		id: string;
		user: { email?: string; uid?: string; name?: string };
		// @ts-expect-error To be implemented
	}): { error: Error | unknown; result: { id: string } } {}
}

export default MemoryAdaptor;
