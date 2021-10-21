.PHONY: dev 
dev:
	deno run --unstable --watch  --allow-all ./src/mod.ts ./example --dev

.PHONY: build 
build:
	deno run --unstable --allow-all ./src/mod.ts ./example

.PHONY: reload 
reload:
	deno cache --unstable ./src/mod.ts --reload

.PHONY: serve 
serve:
	python3 -m http.server 8080 --directory ./build

.PHONY: fmt
fmt:
	deno fmt src/
