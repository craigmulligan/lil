//import { build } from "./build.ts";
import { serve } from "./serve.ts";
import { flags } from "./deps.ts";

type Args = { dev?: boolean; _: string[] };

const args = flags.parse(Deno.args) as Args;
const dirName = args._[0] || "./";

if (args.dev) {
  serve(dirName);
} else {
  // build(dirName);
}
