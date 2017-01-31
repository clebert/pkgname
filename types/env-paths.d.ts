declare module 'env-paths' {
  interface EnvPaths {
    readonly data: string;
    readonly config: string;
    readonly cache: string;
    readonly log: string;
    readonly temp: string;
  }

  function createEnvPaths(name: string): EnvPaths;

  export = createEnvPaths;
}
