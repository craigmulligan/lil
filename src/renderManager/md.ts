import { getOutputFsPath, render, template } from "./utils.ts";
import { fs } from "../deps.ts";
import Renderer from "./renderer.ts"

export default class Md extends Renderer {
  async serve(fsPath: string) {
    const content = await Deno.readTextFile(fsPath);
    const html = render(content, "/");
    const body = template(html, true);
    const headers = new Headers();
    headers.set("content-type", "text/html;charset=utf-8");

    return new Response(body, {
      status: 200,
      headers,
    });
  }

  async build(fsPath: string) {
    const content = await Deno.readTextFile(fsPath);
    const outputName = getOutputFsPath(fsPath, ".html");
    const htmlContent = render(content, "/");
    const html = template(htmlContent, false);

    await fs.ensureFile(outputName);
    return Deno.writeTextFile(outputName, html);
  }
}
