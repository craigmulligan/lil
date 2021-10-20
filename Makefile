dev:
	deno run --unstable --watch  --allow-all ./src/index.ts ./example --dev

build:
	deno run ./src/index.ts ./example --dev

reload:
	deno cache --unstable ./src/index.ts --reload
