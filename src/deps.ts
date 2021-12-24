/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
export { default as frontMatter } from "https://esm.sh/front-matter@4.0.2";

export { default as marked } from "https://esm.sh/marked@3.0.7";
export { default as Prism } from "https://esm.sh/prismjs@1.25.0";
export * as FeedGenerator from "https://esm.sh/feed@4.2.2"

export * as path from "https://deno.land/std@0.113.0/path/mod.ts";
export * as flags from "https://deno.land/std@0.113.0/flags/mod.ts";

import { exists } from "https://deno.land/std@0.113.0/fs/exists.ts";
import { walk } from "https://deno.land/std@0.113.0/fs/walk.ts";
import { ensureFile } from "https://deno.land/std@0.113.0/fs/ensure_file.ts";
import { emptyDir } from "https://deno.land/std@0.113.0/fs/empty_dir.ts";
// cant export fs/mod.ts because it requires unstable.
const fs = {
  exists,
  walk,
  ensureFile,
  emptyDir,
};

export { fs };
