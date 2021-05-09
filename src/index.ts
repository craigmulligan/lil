import { build } from "./build.ts";
import { serve } from "./serve.ts";
import { parse } from "https://deno.land/std@0.95.0/flags/mod.ts";

type Args = { dev?: boolean; _: string[] };

const args = parse(Deno.args) as Args;
const dirName = args._[0] || "./";

if (args.dev) {
  serve(dirName);
} else {
  build(dirName);
}
