import type { FastifyRequest, FastifyReply } from "fastify";

const verifyAPIKey = async (req: FastifyRequest, reply: FastifyReply) => {
	const db = await import("../db");

	if (!req.headers["authorization"])
		return reply.code(401).send({ error: "Unauthorized" });

	const { result: isValid, error } = await db.default.validateAPIKey(
		req.headers["authorization"].split(" ")[0]
	);

	if (error || !isValid) return reply.code(401).send({ error: "Unauthorized" });
};

export default verifyAPIKey;
