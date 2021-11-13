import { fs } from "../deps.ts";
import Renderer from "./renderer.ts";
import { Buffer } from "https://deno.land/std/io/mod.ts";

export default class Generic extends Renderer {
  async serve(fsPath: string) {
    const [file, fileInfo] = await Promise.all([
      Deno.readFile(fsPath),
      Deno.stat(fsPath),
    ]);

    const headers = new Headers();
    headers.set("content-length", fileInfo.size.toString());
    const contentTypeValue = Renderer.getContentType(fsPath);
    if (contentTypeValue) {
      headers.set("content-type", contentTypeValue);
    }
    return new Response(file, {
      status: 200,
      headers,
    });
  }

  async build(fsPath: string) {
    const outfileName = this.getOutputFsPath(fsPath);
    await fs.ensureFile(outfileName);
    return Deno.copyFile(fsPath, outfileName);
  }
}
