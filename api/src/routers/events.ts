import type { FastifyInstance } from "fastify";

import verifyAPIKey from "../middleware/verify-api-key";

async function eventsRoutes(fastify: FastifyInstance) {
	fastify.addHook("preHandler", verifyAPIKey);

	// Routes
}

export default eventsRoutes;
