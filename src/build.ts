import { DirName, Options } from "./types.ts";
import { fs } from "./deps.ts";
import RenderManager from "./renderManager/mod.ts";

export default async function build(
  dirName: DirName,
  opts: Options,
): Promise<void> {
  await fs.emptyDir("./build");
  const builds = [];
  const renderManager = new RenderManager(dirName, opts);

  for await (
    const entry of fs.walk(dirName, {
      includeDirs: false,
    })
  ) {
    const build = renderManager.build(entry.path);
    builds.push(build);
  }

  await Promise.all(builds);
}
