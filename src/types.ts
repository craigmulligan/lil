export type IsDev = boolean;
export type DirName = string;

export type FrontMatterData = {
  title?: string;
  description?: string;
  published_at?: string;
  keywords?: string;
  author?: string;
};

export type LilMetadata = {
  version: string;
};

export type Options = {
  dev?: IsDev;
  _: DirName[];
  accentColor: string;
  // TODO change to baseURL
  baseUrl: string;
  help: boolean;
  h: boolean;
  styleURL: string;
  version: boolean;
};
