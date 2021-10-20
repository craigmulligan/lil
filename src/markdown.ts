// taken from https://github.com/lucacasonato/deno-gfm/blob/main/mod.ts
import { emojify, marked, Prism, sanitizeHtml } from "./deps.ts";

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
    // a language of `ts, ignore` should really be `ts`
    language = language.split(",")[0];
    const grammar = Object.hasOwnProperty.call(Prism.languages, language)
      ? Prism.languages[language]
      : undefined;
    if (grammar === undefined) {
      return `<pre><code>${code}</code></pre>`;
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
  markdown = emojify(markdown);

  const html = marked(markdown, {
    baseUrl,
    gfm: true,
    renderer: new Renderer(),
  });

  return html

  // return sanitizeHtml(html, {
  //   allowedTags: sanitizeHtml.defaults.allowedTags.concat([
  //     "img",
  //     "svg",
  //     "path",
  //   ]),
  //   allowedAttributes: {
  //     ...sanitizeHtml.defaults.allowedAttributes,
  //     img: ["src", "alt", "height", "width", "align"],
  //     a: ["id", "aria-hidden", "href", "tabindex", "rel"],
  //     svg: ["viewbox", "width", "height", "aria-hidden"],
  //     path: ["fill-rule", "d"],
  //   },
  //   allowedClasses: {
  //     div: ["highlight"],
  //     span: [
  //       "token",
  //       "keyword",
  //       "operator",
  //       "number",
  //       "boolean",
  //       "function",
  //       "string",
  //       "comment",
  //       "class-name",
  //       "regex",
  //       "regex-delimiter",
  //     ],
  //     a: ["anchor"],
  //   },
  //   allowProtocolRelative: false,
  // });
}
