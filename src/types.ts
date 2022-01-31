export type IsDev = boolean;
export type DirName = string;

export type FrontMatterData = {
  title?: string;
  description?: string;
  publishedAt?: string;
  keywords?: string;
  author?: string;
  body?: string;
};

export type LilMetadata = {
  version: string;
};

export type Options = {
  dev?: IsDev;
  _: DirName[];
  accentColor: string;
  baseUrl: string;
  help: boolean;
  h: boolean;
  styleURL: string;
  version: boolean;
};
