dev:
	deno run --watch --unstable --allow-all ./src/index.ts ./example --dev

build:
	deno run ./src/index.ts ./example --dev
