import { path } from "../deps.ts";

const MEDIA_TYPES: Record<string, string> = {
  ".md": "text/markdown",
  ".html": "text/html",
  ".htm": "text/html",
  ".json": "application/json",
  ".map": "application/json",
  ".txt": "text/plain",
  ".ts": "text/typescript",
  ".tsx": "text/tsx",
  ".js": "application/javascript",
  ".jsx": "text/jsx",
  ".gz": "application/gzip",
  ".css": "text/css",
  ".wasm": "application/wasm",
  ".mjs": "application/javascript",
  ".svg": "image/svg+xml",
};

export default abstract class Renderer {
  dirName: string

  constructor(dirName: string) {
    this.dirName = dirName
  }

  static getContentType(pathname: string): string | undefined {
    return MEDIA_TYPES[path.extname(pathname)];
  }

  getOutputFsPath(
    fsPath: string,
    targetExt?: string,
  ) {
    const relativefileName = path.relative(this.dirName, fsPath);
    const currentExt = path.extname(fsPath);

    if (!targetExt) {
      targetExt = currentExt;
    }

    return path.join(
      "build",
      `${relativefileName.replace(currentExt, "")}${targetExt}`,
    );
  }


  public abstract build(fileName: string): Promise<void>;
  public abstract serve(fileName: string): Promise<Response>;
}
