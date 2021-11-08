.PHONY: dev 
dev:
	deno run --unstable --watch --allow-all ./src/mod.ts ./example --dev

.PHONY: build 
build:
	deno run --allow-all ./src/mod.ts ./example

.PHONY: test
test:
	deno test --allow-all

.PHONY: test_watch 
test_watch:
	deno test --allow-all --watch

.PHONY: reload 
reload:
	deno cache ./src/mod.ts --reload --unstable

.PHONY: serve 
serve:
	python3 -m http.server 8080 --directory ./build

.PHONY: fmt
fmt:
	deno fmt src/

.PHONY: fmt_check
fmt_check:
	deno fmt src/ --check

.PHONY: compile
compile:
	deno compile --allow-all --output ./bin/lil ./src/mod.ts

.PHONY: help
help:
	deno run --allow-all ./src/mod.ts -h
