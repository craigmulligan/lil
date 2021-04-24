# lil

> A *dead-simple* lil static site generator.

This means.

* NO coniguration files
* NO taxonomy systems
* NO templating languages
* NO javascript frameworks

If you have thoughts you'd like to put on the web in a clean readable format, but don't want to **faf** with configuring & customizing a site generator then `lil` maybe for you.

[Basically](Basically) you chuck some markdown files in a directory and run `lil` - *not much more too it*.

There are a few things baked in.

- Live reloads in dev mode.
- Automatic code styling.
- Basic over-writeable [stylesheet](./style.css).

## Install

You can download the [latest release](https://github.com/hobochild/lil/releases)

## Usage:

Create a page

```bash
echo "# Hello World!" > index.md
```

If you want to overwrite the default styles put create a css file.

```bash
echo "body { background: red; }" > style.css
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
