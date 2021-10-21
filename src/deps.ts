/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

export { emojify } from "https://deno.land/x/emoji@0.1.2/mod.ts";
export { default as marked } from "https://esm.sh/marked@3.0.7";
export * as Prism from "https://esm.sh/prismjs@1.25.0";
export { default as sanitizeHtml } from "https://esm.sh/sanitize-html@2.5.2";

export * as path from "https://deno.land/std/path/mod.ts";
export * as flags from "https://deno.land/std/flags/mod.ts";

import { exists } from "https://deno.land/std/fs/exists.ts";
import { walk } from "https://deno.land/std/fs/walk.ts";
import { ensureFile } from "https://deno.land/std/fs/ensure_file.ts";
import { emptyDir } from "https://deno.land/std/fs/empty_dir.ts";

// cant export fs/mod.ts because it requires unstable.
const fs = {
  exists,
  walk,
  ensureFile,
  emptyDir,
};

export { fs };