import { MongoClient } from "mongodb";

const client = new MongoClient('mongodb://127.0.0.1:27017');
const database = client.db('finances');

const dataApi: DataApi = {
  query: async () => 'query',
  exec: async () => 'exec',
  insertOne: async (collection: string, obj: any) => {
    const movies = database.collection(collection);
    const result = await movies.insertOne(obj);
    return 'insertOne';
  },
}

let setup = false;

export function setupIpc(ipcMain: Electron.IpcMain) {
  if (!setup) {
    ipcMain.handle('query', dataApi.query);
    ipcMain.handle('exec', dataApi.exec);
    ipcMain.handle('insertOne', (_, collection, obj) => dataApi.insertOne(collection, obj)); // Super ugly, but it works.

    setup = true;
  }
}
