import { DirName, Options } from "./types.ts";
import { fs, path } from "./deps.ts";
import ReloadManager from "./reloadManager.ts";
import RenderManager from "./renderManager/mod.ts";

async function serveError(err: Error) {
  const headers = new Headers();
  headers.set("content-type", "text/plain");

  return new Response(err.message, {
    status: 200,
    headers,
  });
}

export default async function serve(dirName: DirName, opts: Options) {
  const server = Deno.listen({ port: 8080 });
  const reloadManager = new ReloadManager(dirName);
  const renderManager = new RenderManager(dirName, opts);
  reloadManager.start();

  async function handleRequest(request: Request) {
    const url = new URL(request.url);

    console.log(`new request : ${url.pathname}`);
    let fsPath = path.join(dirName, url.pathname);

    if (url.pathname === "/_reload") {
      const upgrade = request.headers.get("upgrade") || "";
      if (upgrade.toLowerCase() != "websocket") {
        return new Response("request isn't trying to upgrade to websocket.");
      }
      const { socket, response } = Deno.upgradeWebSocket(request);
      reloadManager.addSocket(socket);
      return response;
    }

    try {
      const fileInfo = await Deno.stat(fsPath);
      if (fileInfo.isDirectory) {
        if (await fs.exists(fsPath + "index.md")) {
          return renderManager.serve(fsPath + "index.md");
        } else if (await fs.exists(fsPath + "index.html")) {
          return renderManager.serve(fsPath + "index.html");
        } else {
          throw Error("Not Found");
        }
      } else {
        return renderManager.serve(fsPath);
      }
    } catch (e) {
      return serveError(e);
    }
  }

  async function handleConnection(conn: Deno.Conn) {
    const httpConn = Deno.serveHttp(conn);
    for await (const requestEvent of httpConn) {
      try {
        await requestEvent.respondWith(handleRequest(requestEvent.request));
      } catch (e) {
        console.log(e);
      }
    }
  }

  console.log(`HTTP webserver running.  Access it at:  http://localhost:8080/`);
  for await (const connection of server) {
    handleConnection(connection);
  }
}
