.PHONY: dev 
dev:
	deno --unstable run --watch --allow-all ./src/mod.ts ./example --dev --styleURL "/style.css"

.PHONY: build 
build:
	deno --unstable run --allow-all ./src/mod.ts ./example

.PHONY: test
test:
	deno  --unstable test  --allow-all

.PHONY: test_watch 
test_watch:
	deno --unstable test --allow-all --watch

.PHONY: reload
reload:
	deno --unstable cache --lock=lock.json ./src/mod.ts --reload

.PHONY: reload_force
reload_force:
	deno --unstable cache --lock=lock.json --lock-write --reload ./src/mod.ts 

.PHONY: serve
serve:
	python3 -m http.server 8080 --directory ./build

.PHONY: lint 
lint:
	deno lint src/

.PHONY: fmt
fmt:
	deno fmt src/

.PHONY: fmt_check
fmt_check:
	deno fmt src/ --check

ensure_bin_dir:
	mkdir -p bin

.PHONY: compile
compile: ensure_bin_dir
	deno --unstable compile --allow-all --output ./bin/lil ./src/mod.ts

.PHONY: compile_all
compile_all: ensure_bin_dir
	deno --unstable compile --target x86_64-unknown-linux-gnu --allow-all --output ./bin/lil-x86_64-unknown-linux-gnu ./src/mod.ts
	deno --unstable compile --target x86_64-pc-windows-msvc --allow-all --output ./bin/lil-x86_64-pc-windows-msvc ./src/mod.ts
	deno --unstable compile --target x86_64-apple-darwin --allow-all --output ./bin/lil-x86_64-pc-windows-msvc ./src/mod.ts
	deno --unstable compile --target aarch64-apple-darwin --allow-all --output ./bin/lil-aarch64-apple-darwin ./src/mod.ts

.PHONY: help
help:
	deno --unstable run --allow-all ./src/mod.ts -h

.PHONY: css_minify 
css_minify:
	yui-compressor example/style.css -o style.min.css
