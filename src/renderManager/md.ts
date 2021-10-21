import { getOutputFsPath, render } from "./utils.ts";
import { fs } from "../deps.ts";
import Renderer from "./renderer.ts"

export default class Md extends Renderer {
  async serve(fsPath: string) {
    const content = await Deno.readTextFile(fsPath);
    const html = render(content, "/", true);
    const headers = new Headers();
    headers.set("content-type", "text/html;charset=utf-8");

    return new Response(html, {
      status: 200,
      headers,
    });
  }

  async build(fsPath: string) {
    const content = await Deno.readTextFile(fsPath);
    const outputName = getOutputFsPath(this.dirName, fsPath, ".html");
    const html = render(content, "/", false);

    console.log(fsPath)
    console.log(outputName)

    await fs.ensureFile(outputName);
    return Deno.writeTextFile(outputName, html);
  }
}
