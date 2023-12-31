import { MongoClient } from 'mongodb';
import { existsSync, readFileSync } from 'fs';
import { app } from 'electron';
import { join } from 'path';

const userDataPath = app.getPath('userData');
const optionsPath = join(userDataPath, 'options.json');
console.log(optionsPath);

let mongo_uri = 'mongodb://127.0.0.1:27017';

if (existsSync(optionsPath)) {
  const overrides = JSON.parse(readFileSync(optionsPath, 'utf8'));
  mongo_uri = overrides.mongo_uri;
}

const client = new MongoClient(mongo_uri);
export const database = client.db('finances');

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

async function findOneHandler(request: IpcFindOne) {
  const collection = database.collection(request.collection);

  if (request.options) {
    return await collection.findOne(request.query, request.options);
  }
  else {
    return await collection.findOne(request.query);
  }
}

async function deleteOneHandler(request: IpcDeleteOne) {
  const collection = database.collection(request.collection);
  await collection.deleteOne(request.query);
}

async function updateOneHandler(request: IpcUpdateOne) {
  const collection = database.collection(request.collection);

  if (request.options) {
    return await collection.updateOne(request.query, request.update, request.options);
  }
  else {
    return await collection.updateOne(request.query, request.update);
  }
}

async function countHandler(request: IpcCount) {
  const collection = database.collection(request.collection);
  return await collection.countDocuments(request.query);
}

async function bulkWriteHandler(request: IpcBulkWrite) {
  const collection = database.collection(request.collection);
  await collection.bulkWrite(request.operations);
}

async function aggregateHandler(request: IpcAggregate) {
  const collection = database.collection(request.collection);
  return await collection.aggregate(request.pipeline).toArray();
}

const handlers = {
  insertOne: insertOneHandler,
  findMany: findManyHandler,
  findOne: findOneHandler,
  deleteOne: deleteOneHandler,
  updateOne: updateOneHandler,
  bulkWrite: bulkWriteHandler,
  count: countHandler,
  aggregate: aggregateHandler,
};

async function dataApi(request: IpcRequest) {
  const handler = handlers[request.kind];

  if (handler) {
    // Because of the union type, we need to cast the request to any.
    return handler(request as any);
  }
  else {
    // TODO: expose backend errors to the frontend
  }
}

let setup = false;

export function setupIpc(ipcMain: Electron.IpcMain) {
  if (!setup) {
    ipcMain.handle('dataApi', (_: unknown, request: IpcRequest) => dataApi(request));

    setup = true;
  }
}
