import { DirName, Options } from "../types.ts";
import Md from "./md.ts";
import Generic from "./generic.ts";
import Render from "./renderer.ts";

export default class RendererManager {
  md: Md;
  generic: Generic;

  constructor(dirName: DirName, opts: Options) {
    this.md = new Md(dirName, opts);
    this.generic = new Generic(dirName, opts);
  }

  serve(fsPath: string) {
    switch (Render.getContentType(fsPath)) {
      case "text/markdown":
        return this.md.serve(fsPath);
      default:
        return this.generic.serve(fsPath);
    }
  }

  build(fsPath: string) {
    switch (Render.getContentType(fsPath)) {
      case "text/markdown":
        return this.md.build(fsPath);
      default:
        return this.generic.build(fsPath);
    }
  }
}
