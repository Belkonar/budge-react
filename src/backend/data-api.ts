import { MongoClient } from "mongodb";

const client = new MongoClient('mongodb://127.0.0.1:27017');
const database = client.db('finances');

async function insertOneHandler(request: IpcInsertOne) {
  const collection = database.collection(request.collection);
  await collection.insertOne(request.obj);
}

// NOTE: This function will require the entire result set to be loaded into memory.
// as such, it should only be used for small-ish queries. For larger queries
// I'll need to implement a cursor-based approach using ipc back to the frontend.
async function findManyHandler(request: IpcFindMany) {
  const collection = database.collection(request.collection);

  if (request.options) {
    return await collection.find(request.query, request.options).toArray();
  }
  else {
    return await collection.find(request.query).toArray();
  }
}

const handlers = {
  insertOne: insertOneHandler,
  findMany: findManyHandler,
};

async function dataApi(request: IpcRequest) {
  const handler = handlers[request.kind];

  if (handler) {
    return handler(request);
  }
  else {
    // TODO: expose backend errors to the frontend
  }
}

let setup = false;

export function setupIpc(ipcMain: Electron.IpcMain) {
  if (!setup) {
    ipcMain.handle('dataApi', (_: any, request: IpcRequest) => dataApi(request));

    setup = true;
  }
}
