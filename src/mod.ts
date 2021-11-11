import { Options } from "./types.ts";
import build from "./build.ts";
import serve from "./serve.ts";
import { flags, path } from "./deps.ts";

const userOpts = flags.parse(Deno.args) as Options;

const version = 'main'
const styleURL = `https://cdn.jsdelivr.net/gh/hobochild/lil@${version}/style.css`

const defaultOpts = {
  styleURL
}

const opts = {
  ...defaultOpts,
  ...userOpts
}

const dirName = path.normalize(opts._[0] || "./");

if (opts.accentColor) {
  const rgb = opts.accentColor.split(",");
  if (rgb.length != 3) {
    console.error("AccentColor must be in the rgb format: 255, 255, 255");
    Deno.exit(1);
  }
}
if (opts.help || opts.h) {
  console.table({
    "dev": "Run dev server",
    "accentColor": "RGB accent color",
    "baseUrl": "Prefix urls - useful for github hosting",
  });
} else if (opts.dev) {
  serve(dirName, opts);
} else {
  build(dirName, opts);
}
