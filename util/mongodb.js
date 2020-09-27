import { MongoClient } from "mongodb";

let cached;

export async function connect() {
  if (cached) return cached;

  const client = await MongoClient.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = await client.db(process.env.MONGO_DB);

  cached = { client, db };

  return cached;
}
