import { defineConfig } from "tsup";
import dotenv from "dotenv";

export default defineConfig((options) => ({
	entry: ["src/index.ts"],
	splitting: false,
	sourcemap: false,
	clean: true,
	minify: !options.watch,
	env: { SERVER_BASE_URL: "", ...dotenv.config().parsed },
}));
