import { fs, path } from "./deps.ts";
import RenderManager from "./renderManager/mod.ts";

export const build = async (dirName: string): Promise<void> => {
  await fs.emptyDir("./build");
  const builds = [];
  const renderManager = new RenderManager(dirName);

  for await (
    const entry of fs.walk(dirName, {
      includeDirs: false,
    })
  ) {
    const build = renderManager.build(entry.path);
    builds.push(build);
  }

  await Promise.all(builds);
};
