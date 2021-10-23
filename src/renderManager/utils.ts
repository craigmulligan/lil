import { frontMatter, marked, Prism } from "../deps.ts";
import { FrontMatterData, Options } from "../types.ts";

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
  opts: Options;

  constructor(opts: Options) {
    super();
    this.opts = opts;
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
    const isInternal = !href.startsWith("http");

    if (isInternal && !this.opts.dev) {
      if (href.endsWith(".md")) {
        href = href.slice(0, -3) + ".html";
      }

      return `<a href="${href}" title="${title}" rel="noopener noreferrer">${text}</a>`;
    }

    return `<a href="${href}" title="${title}" rel="noopener noreferrer">${text}</a>`;
  }
}

export function render(
  url: string,
  markdown: string,
  opts: Options,
): string {
  if (!markdown) {
    return "";
  }
  const { attributes, body } = frontMatter(markdown);

  const html = marked(body, {
    baseUrl: opts.baseUrl,
    gfm: true,
    renderer: new Renderer(opts),
    xhtml: true,
  });

  return template(url, html, opts, attributes as FrontMatterData);
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

const homeLink = `<div>
      <small>
        <a id="home" href="/">
          &#8592;
          Home
        </a>
      </small>
    </div>`;

const accentColorStyles = (accentColor: Options["accentColor"]) => {
  return `<style>
    :root {
      --accent-color: ${accentColor};
    }
  </style>`;
};

const template = (
  url: string,
  content: string,
  opts: Options,
  frontMatter: FrontMatterData = {},
) => {
  const isHome = url === "index.html";

  return `
  <html>
  <head>
    <title>
      ${frontMatter.title}
    </title>
    <meta name="description" content="${frontMatter.description}">
    <meta name="keywords" content="${frontMatter.keywords}">
    <meta name="author" content="${frontMatter.author}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/style.css" />
    ${opts.accentColor ? accentColorStyles(opts.accentColor) : ""} 
    <meta property="og:title" content="${frontMatter.title}" />
    <meta property="og:description" content="${frontMatter.description}" />
    <meta property="og:type" content="article" />
  </head>
  <body>
    <div>
    <article>
    ${isHome ? "" : homeLink}
    ${content}
    </article>
    </div>
    </content>
  </body>
  ${opts.dev ? reloadScript : ""}
  </html>
  `;
};
