import {
  serve as Server,
  ServerRequest,
  Response,
} from "https://deno.land/std@0.95.0/http/server.ts";
import { posix } from "https://deno.land/std@0.95.0/path/mod.ts";
import { contentType, md2html } from "./utils.ts";

function normalizeURL(url: string): string {
  let normalizedUrl = url;
  try {
    normalizedUrl = decodeURI(normalizedUrl);
  } catch (e) {
    if (!(e instanceof URIError)) {
      throw e;
    }
  }

  try {
    //allowed per https://www.w3.org/Protocols/rfc2616/rfc2616-sec5.html
    const absoluteURI = new URL(normalizedUrl);
    normalizedUrl = absoluteURI.pathname;
  } catch (e) {
    //wasn't an absoluteURI
    if (!(e instanceof TypeError)) {
      throw e;
    }
  }

  if (normalizedUrl[0] !== "/") {
    throw new URIError("The request URI is malformed.");
  }

  normalizedUrl = posix.normalize(normalizedUrl);
  const startOfParams = normalizedUrl.indexOf("?");
  return startOfParams > -1
    ? normalizedUrl.slice(0, startOfParams)
    : normalizedUrl;
}

async function serveFile(
  request: ServerRequest,
  fsPath: string
): Promise<Response> {
  const [file, fileInfo] = await Promise.all([
    Deno.open(fsPath),
    Deno.stat(fsPath),
  ]);
  const headers = new Headers();
  headers.set("content-length", fileInfo.size.toString());
  const contentTypeValue = contentType(fsPath);
  if (contentTypeValue) {
    headers.set("content-type", contentTypeValue);
  }
  request.done.then(() => {
    file.close();
  });

  return {
    status: 200,
    body: file,
    headers,
  };
}

async function serveMd(request: ServerRequest, fsPath: string) {
  const content = await Deno.readTextFile(fsPath);
  const body = await md2html(content);
  const headers = new Headers();
  headers.set("content-type", "text/html");

  return {
    status: 200,
    body,
    headers,
  };
}

async function process(request: ServerRequest, fsPath: string) {
  switch (contentType(fsPath)) {
    case "text/markdown":
      return serveMd(request, fsPath);
    default:
      return serveFile(request, fsPath);
  }
}

export const serve = async (dirName: string) => {
  const server = Server({ port: 8080 });
  console.log(`HTTP webserver running.  Access it at:  http://localhost:8080/`);

  for await (const request of server) {
    const normalizedUrl = normalizeURL(request.url);
    let fsPath = posix.join(dirName, normalizedUrl);
    if (fsPath.indexOf(dirName) !== 0) {
      fsPath = dirName;
    }

    const fileInfo = await Deno.stat(fsPath);
    if (fileInfo.isDirectory) {
      fsPath = fsPath + "/index.md";
    }

    const res = await process(request, fsPath);
    request.respond(res);
  }
};
