import type { FastifyInstance } from "fastify";

import verifyAPIKey from "../middleware/verify-api-key";

import acceptEvents from "../controllers/accept-events";
import getEventsForReplay from "../controllers/get-events-for-replay";

async function eventsRoutes(fastify: FastifyInstance) {
	fastify.addHook("preHandler", verifyAPIKey);

	// Routes
	fastify.post("/track", acceptEvents);
	fastify.get("/replay", getEventsForReplay);
}

export default eventsRoutes;
