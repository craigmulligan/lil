import { acceptWebSocket, WebSocket } from "https://deno.land/std@0.95.0/ws/mod.ts"

export default class ReloadManager {
  // https://blog.logrocket.com/using-websockets-with-deno/#creating-websocket-server
  dirName: string
  socket: WebSocket | null

  constructor(dirName: string) {
    this.dirName = dirName;
    this.socket = null
  }

  handleWsEvent = async (sock: WebSocket) => {
    console.log(`new socket.`);
    this.socket = sock
  }

  async handleFsEvent(e: Deno.FsEvent) {
    console.log("New filesystem event")
    if (this.socket && !this.socket.isClosed) {
      try {
        this.socket.send("RELOAD")
      } catch (err) { console.log(e) }
    }

  }

  async start() {
    console.log(`watching... ${this.dirName}`);
    const watcher = Deno.watchFs(this.dirName);
    for await (const event of watcher) {
      this.handleFsEvent(event)
    }
  }
}
