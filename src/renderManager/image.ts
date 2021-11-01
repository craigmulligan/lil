// https://dev.to/franciscomendes10866/image-compression-with-node-js-4d7h
// https://github.com/GoogleChromeLabs/squoosh/tree/dev/libsquoosh
import { sharp } from "../deps.ts";
import Renderer from "./renderer.ts";

export default class Image extends Renderer {
  async serve(fsPath: string) {
    const [_, fileInfo] = await Promise.all([
      Deno.open(fsPath),
      Deno.stat(fsPath),
    ]);
    const headers = new Headers();
    headers.set("content-length", fileInfo.size.toString());
    const contentTypeValue = Renderer.getContentType(fsPath);
    if (contentTypeValue) {
      headers.set("content-type", contentTypeValue);
    }

    // TODO stream response.
    const content = await Deno.readTextFile(fsPath);
    return new Response(content, {
      status: 200,
      headers,
    });
  }

  async build(fsPath: string) {
    const outfileName = this.getOutputFsPath(fsPath);
    const buffer = await Deno.readFile(fsPath);
    return sharp(buffer)
      .webp({ quality: 20 })
      .toFile(outfileName);
  }
}
