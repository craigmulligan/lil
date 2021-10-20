import { path, exists } from "./deps.ts";
import { contentType, md2html } from "./utils.ts";
import ReloadManager from "./reload.ts"

async function serveRaw(
  request: Request,
  fsPath: string
): Promise<Response> {
  const [file, fileInfo] = await Promise.all([
    Deno.open(fsPath),
    Deno.stat(fsPath),
  ]);

  const content = await Deno.readTextFile(fsPath);
  const headers = new Headers();
  headers.set("content-length", fileInfo.size.toString());
  const contentTypeValue = contentType(fsPath);
  if (contentTypeValue) {
    headers.set("content-type", contentTypeValue);
  }

  return new Response(content, {
    status: 200,
    headers,
  });
}

async function serveMd(request: Request, fsPath: string) {
  const content = await Deno.readTextFile(fsPath);
  const body = await md2html(content);
  const headers = new Headers();
  headers.set("content-type", "text/html");

  return new Response(body, {
    status: 200,
    headers,
  });
}


async function serveError(request: Request, err: Error) {
  const headers = new Headers();
  headers.set("content-type", "text/plain");

  return new Response(err.message, {
    status: 200,
    headers,
  });
}

async function serveFile(request: Request, fsPath: string) {
  switch (contentType(fsPath)) {
    case "text/markdown":
      return serveMd(request, fsPath);
    default:
      return serveRaw(request, fsPath);
  }
}


export const serve = async (dirName: string) => {
  async function handleRequest(request: Request) {
    const url = new URL(request.url);

    console.log(`new request : ${url.pathname}`)
    let fsPath = path.join(dirName, url.pathname);

    if (url.pathname === "/_reload") {
      const upgrade = request.headers.get("upgrade") || "";
      if (upgrade.toLowerCase() != "websocket") {
        return new Response("request isn't trying to upgrade to websocket.");
      }
      const { socket, response } = Deno.upgradeWebSocket(request);
      reloadManager.addSocket(socket)
      return response
    }

    try {
      try {
        const fileInfo = await Deno.stat(fsPath);
        if (fileInfo.isDirectory) {
          if (await exists(fsPath + "index.md")) {
            return serveFile(request, fsPath + "index.md");
          } else if (await exists(fsPath + "index.html")) {
            return serveFile(request, fsPath + "index.html");
          } else {
            throw Error("Not Found")
          }
        } else {
          return serveFile(request, fsPath);
        }
      } catch (e) {
        if (e instanceof Deno.errors.NotFound) {
          if (await exists(fsPath + ".md")) {
            return serveFile(request, fsPath + ".md");
          } else if (await exists(fsPath + ".html")) {
            return serveFile(request, fsPath + ".html");
          } else {
            throw e
          }
        } else {
          throw e
        }
      }
    }
    catch (e) {
      return serveError(request, e)
    }
  }

  async function handleConnection(conn: Deno.Conn) {
    const httpConn = Deno.serveHttp(conn);
    for await (const requestEvent of httpConn) {
      await requestEvent.respondWith(handleRequest(requestEvent.request));
    }
  }

  const server = Deno.listen({ port: 8080 });
  const reloadManager = new ReloadManager(dirName)
  reloadManager.start()

  console.log(`HTTP webserver running.  Access it at:  http://localhost:8080/`);
  for await (const connection of server) {
    handleConnection(connection);
  }
};
