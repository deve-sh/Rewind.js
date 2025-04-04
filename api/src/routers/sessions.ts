import type { FastifyInstance } from "fastify";

import verifyAPIKey from "../middleware/verify-api-key";

import createSession from "../controllers/create-session";
import listSessions from "../controllers/list-sessions";

async function sessionsRoutes(fastify: FastifyInstance) {
	fastify.addHook("preHandler", verifyAPIKey);

	// Routes
	fastify.post("/", createSession);
	fastify.get("/list", listSessions);
}

export default sessionsRoutes;
