import { DirName } from "../types.ts";
import Md from "./md.ts";
import Generic from "./generic.ts";
import { getContentType } from "./utils.ts";

export default class RendererManager {
  md: Md;
  generic: Generic;

  constructor(dirName: DirName) {
    this.md = new Md(dirName);
    this.generic = new Generic(dirName);
  }

  async serve(fsPath: string) {
    switch (getContentType(fsPath)) {
      case "text/markdown":
        return this.md.serve(fsPath);
      default:
        return this.generic.serve(fsPath);
    }
  }

  async build(fsPath: string) {
    switch (getContentType(fsPath)) {
      case "text/markdown":
        return this.md.build(fsPath);
      default:
        return this.generic.build(fsPath);
    }
  }
}
