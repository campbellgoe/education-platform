import type { Mongoose } from "mongoose";

declare global {
  var mongoose: MongooseCache;
  var cached: { mongoose: { conn: null | Mongoose, promise: null | Promise<Mongoose>} };
}
export interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

