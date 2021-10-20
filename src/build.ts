import { recursiveReaddir } from "https://deno.land/x/recursive_readdir/mod.ts";
import {
  join,
  extname,
  dirname,
  relative,
} from "https://deno.land/std/path/mod.ts";
import { emptyDir } from "https://deno.land/std/fs/empty_dir.ts";
import { ensureFile } from "https://deno.land/std/fs/ensure_file.ts";
import { walk, WalkEntry } from "https://deno.land/std/fs/walk.ts";

import { md2html } from "./utils.ts";

type File = { name: string; content: string };

const getOutputPath = (path: string, currentExt: string, targetExt: string) => {
  const relativePath = relative(".", path);
  return join("build", `${relativePath.replace(currentExt, "")}${targetExt}`);
};

const renderMd = async (path: string) => {
  const content = await Deno.readTextFile(path);
  const outputName = getOutputPath(path, ".md", ".html");
  const htmlContent = md2html(content);

  await ensureFile(outputName);
  await Deno.writeTextFile(outputName, htmlContent);
};

export const build = async (dirName: string, watch = false): Promise<void> => {
  await emptyDir("./build");

  let renders = [];
  let paths = [];

  for await (const entry of walk(dirName, {
    includeDirs: false,
    exts: ["md"],
  })) {
    paths.push(entry.path);
    const r = renderMd(entry.path);
    renders.push(r);
  }

  // render
  await Promise.all(renders);

  while (watch) {
    console.log(`watching... ${dirName}`);
    const watcher = Deno.watchFs(dirName);
    for await (const event of watcher) {
      if (["create", "remove", "modify"].includes(event.kind)) {
        for (const path of event.paths) {
          console.log(`detected change: ${event.kind} - ${path}`);
        }
      }

      if (event.kind === "create") {
        for (const path of event.paths) {
          await renderMd(path);
        }
      }

      if (event.kind === "remove") {
        for (const path of event.paths) {
          const outputName = getOutputPath(path, ".md", ".html");
          await Deno.remove(outputName);
        }
      }

      if (event.kind === "modify") {
        for (const path of event.paths) {
          await renderMd(path);
        }
      }
    }
  }
};
