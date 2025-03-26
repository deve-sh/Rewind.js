export type Session = {
	id: string;
	user: {
		email?: string;
		uid?: string;
		name?: string;
	};
};

export type Chunk =
	| {
			event: "mousemove";
			x: number;
			y: number;
	  }
	| { event: "scaffolding"; html: string }
	| { event: "mutation"; metadata: any };

type AdaptorMethodResponse<T> = Promise<{ error: Error | unknown; result: T }>;

export interface DBAdaptor {
	getSessions: (filters: Record<string, any>) => AdaptorMethodResponse<{
		count: number;
		limit: number;
		offset: number;
		sessions: Session[];
	}>;

	deleteSession: (id: string) => AdaptorMethodResponse<{ deleted: boolean }>;
	createSession: (session: Session) => AdaptorMethodResponse<{ id: string }>;

	getSessionChunks: (
		time: [string, string]
	) => AdaptorMethodResponse<{ chunks: Chunk[] }>;

	ingestSessionChunks: (
		events: any[],
		sessionId: string
	) => AdaptorMethodResponse<boolean>;

	generateAPIKey: (metadata: Record<string, any>) => AdaptorMethodResponse<string>;

	validateAPIKey: (key: string) => AdaptorMethodResponse<boolean>;
}
