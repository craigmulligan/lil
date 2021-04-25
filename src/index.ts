import { recursiveReaddir } from "https://deno.land/x/recursive_readdir/mod.ts";
import {
  join,
  extname,
  dirname,
  relative,
} from "https://deno.land/std@0.95.0/path/mod.ts";
import { parseMarkdown } from "https://deno.land/x/markdown_wasm/mod.ts";
import { emptyDir } from "https://deno.land/std@0.95.0/fs/empty_dir.ts";
import { ensureFile } from "https://deno.land/std@0.95.0/fs/ensure_file.ts";
import { walk, WalkEntry } from "https://deno.land/std@0.95.0/fs/walk.ts";

type File = { name: string; content: string };

const template = (content: string) => {
  return `
  <html>
  <script src="https://cdn.jsdelivr.net/gh/hyrious/github-markdown-css/github-markdown.css"></script>
  <body>
    ${content}
  </body>
  </html>
  `;
};

const getOutputPath = (path: string, currentExt: string, targetExt: string) => {
  const relativePath = relative(".", path);
  return join("build", `${relativePath.replace(currentExt, "")}${targetExt}`);
};

const md2html = (content: string) => {
  if (!content) {
    return "";
  }
  const htmlContent = parseMarkdown(content);

  return template(htmlContent);
};

const renderMd = async (path: string) => {
  const content = await Deno.readTextFile(path);
  const outputName = getOutputPath(path, ".md", ".html");
  const htmlContent = md2html(content);

  await ensureFile(outputName);
  await Deno.writeTextFile(outputName, htmlContent);
};

const build = async (dirName: string, watch = false): Promise<void> => {
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

build("./example", false);
