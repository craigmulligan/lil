import { DirName, IsDev } from "./types.ts";
import { build } from "./build.ts";
import { serve } from "./serve.ts";
import { flags, path } from "./deps.ts";

type Args = { dev?: IsDev; _: DirName[] };
const args = flags.parse(Deno.args) as Args;
const dirName = path.normalize(args._[0] || "./");

if (args.dev) {
  serve(dirName);
} else {
  build(dirName);
}
