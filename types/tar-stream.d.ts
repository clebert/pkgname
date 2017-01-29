declare module 'tar-stream' {
  export interface Header {
    readonly name: string;
  }

  export interface TarStream extends NodeJS.ReadWriteStream {
    on(event: 'entry', listener: (header: Header, stream: NodeJS.ReadableStream, next: () => void) => void): this;
    on(event: 'finish', listener: () => void): this;
  }

  export function extract(): TarStream;
}
