import Fastify from "fastify";

import { config as loadEnvVariables } from "dotenv";

loadEnvVariables();

const fastify = Fastify({ logger: true });

fastify.get("/", async function handler() {
	return { message: "In Progress" };
});

const PORT = Number(process.env.PORT || 3210);

fastify
	.listen({ port: PORT })
	.then(() => console.log("Server listening on port", PORT))
	.catch((err) => {
		fastify.log.error(err);
		process.exit(1);
	});
