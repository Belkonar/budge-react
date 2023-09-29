interface DataApi {
  query: () => Promise<string>;
  exec: () => Promise<string>;
}
