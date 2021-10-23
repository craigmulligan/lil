.PHONY: dev 
dev:
	deno run --watch --allow-all ./src/mod.ts ./example --dev

.PHONY: build 
build:
	deno run --allow-all ./src/mod.ts ./example

.PHONY: reload 
reload:
	deno cache ./src/mod.ts --reload

.PHONY: serve 
serve:
	python3 -m http.server 8080 --directory ./build

.PHONY: fmt
fmt:
	deno fmt src/

.PHONY: compile
compile:
	deno compile --allow-all --output ./bin/lil ./src/mod.ts

.PHONY: help
help:
	deno run --allow-all ./src/mod.ts -h
