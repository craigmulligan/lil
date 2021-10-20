import { path } from "./deps.ts";
import { CSS, render } from "./markdown.ts";

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
  <style>
  ${CSS}
  </style>
  <body>
    <content data-color-mode="auto" data-light-theme="light" data-dark-theme="dark" class="markdown-body">
    ${content}
    </content>
  </body>
  ${reloadScript}
  </html>
  `;
};

export const md2html = (content: string) => {
  if (!content) {
    return "";
  }
  const htmlContent = render(content, "/");

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
export function contentType(pathname: string): string | undefined {
  return MEDIA_TYPES[path.extname(pathname)];
}
