export default class ReloadManager {
  dirName: string;
  socket: WebSocket | null;

  constructor(dirName: string) {
    this.dirName = dirName;
    this.socket = null;
  }

  addSocket(socket: WebSocket) {
    console.log(`new socket.`);
    this.socket = socket;
  }

  async handleFsEvent(e: Deno.FsEvent) {
    console.log("New filesystem event");
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      try {
        this.socket.send("RELOAD");
      } catch (err) {
        console.log(e);
      }
    }
  }

  async start() {
    console.log(`watching... ${this.dirName}`);
    const watcher = Deno.watchFs(this.dirName);
    for await (const event of watcher) {
      this.handleFsEvent(event);
    }
  }
}
