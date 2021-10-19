import { parseMarkdown } from "https://deno.land/x/markdown_wasm/mod.ts";
import { extname } from "https://deno.land/std@0.95.0/path/mod.ts";

const reloadScript = `
  <script>
    const websocket = new WebSocket("ws://localhost:8080/_reload")

    websocket.onmessage = (message) => {
        if (message.data === "RELOAD") {
          console.log("reloading")
          location.reload()
        }
    }
  </script>
`

const template = (content: string) => {
  return `
  <html>
  <link rel="stylesheet" href="/style.css" />
  <link rel="stylesheet" src="https://cdn.jsdelivr.net/gh/hyrious/github-markdown-css/github-markdown.css" />
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


export async function Watcher(dirName: string, callback: (e: Deno.FsEvent) => void) {
  console.log(`watching... ${dirName}`);
  const watcher = Deno.watchFs(dirName);
  for await (const event of watcher) {
    callback(event)
  }
}

