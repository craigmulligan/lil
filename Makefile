.PHONY: dev 
dev:
	deno --unstable run --watch --allow-all ./src/mod.ts ./example --dev

.PHONY: build 
build:
	deno --unstable run --allow-all ./src/mod.ts ./example

.PHONY: test
test:
	deno --unstable test --allow-all

.PHONY: test_watch 
test_watch:
	deno --unstable test --allow-all --watch

.PHONY: reload 
reload:
	deno --unstable cache ./src/mod.ts --reload

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
	deno --unstable compile --allow-all --output ./bin/lil ./src/mod.ts

.PHONY: help
help:
	deno --unstable run --allow-all ./src/mod.ts -h
