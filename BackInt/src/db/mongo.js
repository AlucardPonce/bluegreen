import { MongoClient } from 'mongodb';

let client;
let db;

/**
 * Returns a connected Db instance.
 * Uses lazy, singleton connection.
 */
export async function getDb() {
  if (db) return db;

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const dbName = process.env.DB_NAME || 'test';

  client = new MongoClient(uri, { ignoreUndefined: true });
  await client.connect();
  db = client.db(dbName);
  return db;
}

export async function closeDb() {
  if (client) {
    await client.close();
    client = undefined;
    db = undefined;
  }
}
