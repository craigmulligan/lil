import { emojify, marked, path, Prism } from "../deps.ts";
import { IsDev, DirName } from "../types.ts";

// TODO: figure out some dynamic importing mechanism.
// awaiting async support in marked.
// https://github.com/markedjs/marked/issues/458
import "https://esm.sh/prismjs@1.25.0/components/prism-typescript?no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-diff?no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-bash?no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-rust?no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-python?no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-json?no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-jsx?no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-java?no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-c?no-check";

class Renderer extends marked.Renderer {
  heading(
    text: string,
    level: 1 | 2 | 3 | 4 | 5 | 6,
    raw: string,
    slugger: marked.Slugger,
  ): string {
    const slug = slugger.slug(raw);
    return `<h${level} id="${slug}"><a class="anchor" aria-hidden="true" tabindex="-1" href="#${slug}">${text}</a></h${level}>`;
  }

  code(code: string, language = "") {
    language = language.split(",")[0];
    const grammar = Object.hasOwnProperty.call(Prism.languages, language)
      ? Prism.languages[language]
      : undefined;
    if (grammar === undefined) {
      return `<pre>${code}</pre>`;
    }
    const html = Prism.highlight(code, grammar, language);
    return `<div class="highlight highlight-source-${language}"><pre>${html}</pre></div>`;
  }

  link(href: string, title: string, text: string) {
    if (href.startsWith("#")) {
      return `<a href="${href}" title="${title}">${text}</a>`;
    }
    return `<a href="${href}" title="${title}" rel="noopener noreferrer">${text}</a>`;
  }
}

export function render(markdown: string, baseUrl: string | undefined): string {
  if (!markdown) {
    return "";
  }
  markdown = emojify(markdown);

  const html = marked(markdown, {
    baseUrl,
    gfm: true,
    renderer: new Renderer(),
  });

  return html;
}

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
`;

export const template = (content: string, isDev: IsDev) => {
  return `
  <html>
  <link rel="stylesheet" href="/style.css" />
  <body>
    <div>
    <article>
    ${content}
    </article>
    </div>
    </content>
  </body>
  ${isDev && reloadScript}
  </html>
  `;
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

export function getContentType(pathname: string): string | undefined {
  return MEDIA_TYPES[path.extname(pathname)];
}

export function getOutputFsPath(
  dirName: DirName,
  fsPath: string,
  targetExt?: string,
) {
  const relativefileName = path.relative(dirName, fsPath);
  const currentExt = path.extname(fsPath);

  if (!targetExt) {
    targetExt = currentExt;
  }

  return path.join(
    "build",
    `${relativefileName.replace(currentExt, "")}${targetExt}`,
  );
}
