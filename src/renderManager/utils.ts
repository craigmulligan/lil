import { marked, frontMatter, Prism } from "../deps.ts";
import { IsDev, FrontMatterData } from "../types.ts";

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
import "https://esm.sh/prismjs@1.25.0/components/prism-css?no-check";

class Renderer extends marked.Renderer {
  isDev: boolean

  constructor(isDev: boolean) {
    super()
    this.isDev = isDev
  }

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
    const isInternal = !href.startsWith("http")

    if (isInternal && !this.isDev) {
      if (href.endsWith(".md")) {
        href = href.slice(0, -3) + ".html"
      }

      return `<a href="${href}" title="${title}" rel="noopener noreferrer">${text}</a>`;
    }

    return `<a href="${href}" title="${title}" rel="noopener noreferrer">${text}</a>`;
  }
}

export function render(markdown: string, baseUrl: string | undefined, isDev: IsDev): string {
  if (!markdown) {
    return "";
  }
  const { attributes, body } = frontMatter(markdown)

  const html = marked(body, {
    baseUrl,
    gfm: true,
    renderer: new Renderer(isDev),
  });

  return template(html, isDev, attributes as FrontMatterData);
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

const template = (content: string, isDev: IsDev, opts: FrontMatterData = {}) => {
  return `
  <html>
  <title>
    ${opts.title}
  </title>
  <meta name="description" content="${opts.description}">
  <meta name="keywords" content="${opts.keywords}">
  <meta name="author" content="${opts.author}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
