import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Defina MONGODB_URI.");

type MongoCache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
const globalForMongo = globalThis as typeof globalThis & { mongooseCache?: MongoCache };
const cache = (globalForMongo.mongooseCache ??= { conn: null, promise: null });

export async function connectDB(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    cache.promise = mongoose.connect(uri!, { bufferCommands: false });
  }
  cache.conn = await cache.promise;
  return cache.conn;
}