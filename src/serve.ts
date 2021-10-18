import {
  serve as Server,
  ServerRequest,
  Response,
} from "https://deno.land/std@0.95.0/http/server.ts";
import { posix } from "https://deno.land/std@0.95.0/path/mod.ts";
import { contentType, md2html, watcher } from "./utils.ts";
import { exists } from "https://deno.land/std@0.95.0/fs/mod.ts"

async function serveRaw(
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


async function serveError(request: ServerRequest, err: Error) {
  const headers = new Headers();
  headers.set("content-type", "text/plain");

  return {
    status: 200,
    body: err.message,
    headers,
  };
}

async function serveFile(request: ServerRequest, fsPath: string) {
  switch (contentType(fsPath)) {
    case "text/markdown":
      return serveMd(request, fsPath);
    default:
      return serveRaw(request, fsPath);
  }
}

export const serve = async (dirName: string) => {
  const server = Server({ port: 8080 });
  let isDirty = false
  watcher(dirName, (e) => {
    console.log("New Change")
    isDirty = true
    console.log({ isDirty })
  })

  console.log(`HTTP webserver running.  Access it at:  http://localhost:8080/`);

  for await (const request of server) {
    const normalizedUrl = posix.normalize(request.url);
    let fsPath = posix.join(dirName, normalizedUrl);

    let response: Response | undefined;

    if (normalizedUrl === "/_reload") {
      // crude live reload.
      if (isDirty) {
        request.respond({
          status: 200,
        });
        isDirty = false
      } else {
        request.respond({
          status: 304
        })
      }
    }

    try {
      try {
        const fileInfo = await Deno.stat(fsPath);
        if (fileInfo.isDirectory) {
          response = await serveFile(request, fsPath);
          if (await exists(fsPath + "index.md")) {
            response = await serveFile(request, fsPath + "index.md");
          } else if (await exists(fsPath + "index.html")) {
            response = await serveFile(request, fsPath + "index.html");
          } else {
            throw Error("Not Found")
          }
        } else {
          response = await serveFile(request, fsPath);
        }
      } catch (e) {
        if (e instanceof Deno.errors.NotFound) {
          if (await exists(fsPath + ".md")) {
            response = await serveFile(request, fsPath + ".md");
          } else if (await exists(fsPath + ".html")) {
            response = await serveFile(request, fsPath + ".html");
          } else {
            throw e
          }
        } else {
          throw e
        }
      }
    }
    catch (e) {
      response = await serveError(request, e)
    }

    request.respond(response);
  }
};
