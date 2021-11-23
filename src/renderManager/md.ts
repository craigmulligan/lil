import { render } from "./utils.ts";
import { fs } from "../deps.ts";
import Renderer from "./renderer.ts";

type RSSFeedItem = {
  title: string,
  url: string,
  datetime: Date,
  content: string,
}

export default class Md extends Renderer {
  // rssFeedItems: RSSFeedItem[]


  async buildStart() {
    // this.rssFeedItems = []
  }

  async serve(fsPath: string) {
    const content = await Deno.readTextFile(fsPath);
    const url = this.getUrl(fsPath, ".html");
    const html = render(url, content, this.opts);
    const headers = new Headers();
    headers.set("content-type", "text/html;charset=utf-8");

    return new Response(html, {
      status: 200,
      headers,
    });
  }

  async build(fsPath: string) {
    const content = await Deno.readTextFile(fsPath);
    const outputName = this.getOutputFsPath(fsPath, ".html");
    const url = this.getUrl(fsPath, ".html");
    const html = render(url, content, this.opts);
    await fs.ensureFile(outputName);
    return Deno.writeTextFile(outputName, html);
  }

  async buildComplete() {
    const outputFs = this.getOutputFsPath(`${this.dirName}/feed.xml`);
    return Deno.writeTextFile(outputFs, "hi");
  }
}
