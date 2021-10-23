# lil

> A _dead-simple_ lil static site generator.

This means.

- NO configuration files
- NO taxonomy systems
- NO templating languages
- NO javascript frameworks

If you have something you'd like to put on the web in a clean readable format,
but don't want to **faf** with configuring & customizing a site generator then
`lil` maybe for you.

[Basically](Basically) you chuck some markdown files in a directory and run
`lil` and get a well designed, fast & accessible website.

There are a few things baked in.

- [x] Fast Live reloads in dev mode.
- [x] Automatic code styling (github like).
- [x] Respects users light/dark mode.
- [] RSS.
- [] Search.
- [] image optimization.
- [] a11y checks.

## Install

You can download the [latest release](https://github.com/hobochild/lil/releases)

## Usage:

Create a page

```bash
echo "# Hello World!" > index.md
```

## Dev mode:

```
lil -d
```

## Build for prod

```
lil
```

Check the `./build` for your static site.
