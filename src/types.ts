export type IsDev = boolean;
export type DirName = string;

export interface Renderer {
  dirName: DirName;

  build: (fileName: string) => Promise<void>;
  serve: (fileName: string) => Promise<Response>;
}
