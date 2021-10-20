dev:
	deno run --unstable --watch  --allow-all ./src/mod.ts ./example --dev

build:
	deno run ./src/mod.ts ./example --dev

reload:
	deno cache --unstable ./src/mod.ts --reload
