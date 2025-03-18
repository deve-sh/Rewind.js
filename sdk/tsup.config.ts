import { defineConfig } from "tsup";
import dotenv from "dotenv";

export default defineConfig((options) => ({
	entry: ["src/index.ts"],
	splitting: false,
	sourcemap: false,
	clean: true,
	minify: !options.watch,
	env: dotenv.config().parsed || {
		SERVER_BASE_URL: "",
	},
}));
