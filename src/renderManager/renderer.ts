export default abstract class Renderer {
  dirName: string

  constructor(dirName: string) {
    this.dirName = dirName
  }

  public abstract build(fileName: string): Promise<void>;
  public abstract serve(fileName: string): Promise<Response>;
}
