import { parseMarkdown } from "https://deno.land/x/markdown_wasm/mod.ts";
import { extname } from "https://deno.land/std@0.95.0/path/mod.ts";

const template = (content: string) => {
  return `
  <html>
  <script src="https://cdn.jsdelivr.net/gh/hyrious/github-markdown-css/github-markdown.css"></script>
  <body>
    ${content}
  </body>
  <script>
    setInterval(function () {
      fetch('/_reload')
      .then(response => response.text())
      .then(shouldReload => {
         if (shouldReload) {
           reload() 
         }
      });
    }, 1000);
  </script>
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
