import { parseMarkdown } from "https://deno.land/x/markdown_wasm/mod.ts";
import { extname } from "https://deno.land/std@0.95.0/path/mod.ts";

const reloadScript = `
  <script>
    setInterval(function () {
      fetch('/_reload')
      .then(response => response.status)
      .then(status => {
         if (status === 200) {
           location.reload()
         }
      }).catch(console.log);
    }, 1000);
  </script>
`

const template = (content: string) => {
  return `
  <html>
  <script src="https://cdn.jsdelivr.net/gh/hyrious/github-markdown-css/github-markdown.css"></script>
  <body>
    ${content}
  </body>
  ${reloadScript}
  </html>
  `;
};

export const md2html = (content: string) => {
  if (!content) {
    return "";
  }
  const htmlContent = parseMarkdown(content);

  return template(htmlContent);
};

const MEDIA_TYPES: Record<string, string> = {
  ".md": "text/markdown",
  ".html": "text/html",
  ".htm": "text/html",
  ".json": "application/json",
  ".map": "application/json",
  ".txt": "text/plain",
  ".ts": "text/typescript",
  ".tsx": "text/tsx",
  ".js": "application/javascript",
  ".jsx": "text/jsx",
  ".gz": "application/gzip",
  ".css": "text/css",
  ".wasm": "application/wasm",
  ".mjs": "application/javascript",
  ".svg": "image/svg+xml",
};

/** Returns the content-type based on the extension of a path. */
export function contentType(path: string): string | undefined {
  return MEDIA_TYPES[extname(path)];
}


export async function watcher(dirName: string, callback: (e: Deno.FsEvent) => void) {
  console.log(`watching... ${dirName}`);
  const watcher = Deno.watchFs(dirName);
  for await (const event of watcher) {
    callback(event)
  }
}
