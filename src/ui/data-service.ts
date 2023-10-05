function ipc<T>(request: IpcRequest): Promise<T> {
  return window.dataApi(request);
}

class DataService {
  // The typing here is for safety, but it's not strictly necessary.
  async insertOne<T>(collection: string, obj: T) {
    const request: IpcInsertOne = {
      kind: 'insertOne',
      collection,
      obj,
    };

    return ipc<void>(request);
  }
}

export const dataService = new DataService();
