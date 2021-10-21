// taken from https://github.com/lucacasonato/deno-gfm/blob/main/mod.ts
import { emojify, marked, Prism } from "./deps.ts";

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
  markdown = emojify(markdown);

  const html = marked(markdown, {
    baseUrl,
    gfm: true,
    renderer: new Renderer(),
  });

  return html
}
