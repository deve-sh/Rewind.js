import type { FastifyInstance } from "fastify";

import verifyAPIKey from "../middleware/verify-api-key";

async function sessionsRoutes(fastify: FastifyInstance) {
	fastify.addHook("preHandler", verifyAPIKey);

	// Routes
}

export default sessionsRoutes;
