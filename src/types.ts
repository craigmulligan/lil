export type IsDev = boolean;
export type DirName = string;

export type FrontMatterData = {
  title?: string;
  description?: string;
  publishedAt?: string;
  keywords?: string;
  author?: string;
};

export type Options = {
  dev?: IsDev;
  _: DirName[];
  accentColor: string;
  baseUrl: string;
  help: boolean;
  h: boolean;
};
