import build from "./build.ts";
import { fs } from "./deps.ts";
import { assertEquals, cheerio } from "./test_deps.ts";

Deno.test("Check build writes all files.", async () => {
  const dirName = "./example";
  const outDirName = "./build";
  const opts = {
    help: false,
    h: false,
    accentColor: "",
    baseUrl: "/",
    _: [dirName],
  };

  const inPaths = [];
  const outPaths = [];

  for await (
    const entry of fs.walk(dirName, {
      includeDirs: false,
    })
  ) {
    inPaths.push(entry.path);
  }

  await build(dirName, opts);

  for await (
    const entry of fs.walk(outDirName, {
      includeDirs: false,
    })
  ) {
    outPaths.push(entry.path);
  }

  assertEquals(inPaths.length, outPaths.length);
});

Deno.test("Check html output", async () => {
  const dirName = "./example";
  const outDirName = "./build";
  const opts = {
    help: false,
    h: false,
    accentColor: "",
    baseUrl: "/",
    _: [dirName],
  };

  await build(dirName, opts);

  const html = await Deno.readTextFile(`${outDirName}/index.html`);
  const $ = cheerio.load(html);

  // Check the title is set correctly 
  const title = $("title").text();
  assertEquals(title.trim(), "lil example site");

  // Check the home link isn't loaded
  const homeLink = $("a#home");
  assertEquals(homeLink.length, 0);

  // Check that the reload script isn't included
  const script = $("script");
  assertEquals(script.length, 0);
});
