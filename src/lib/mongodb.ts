import mongoose from 'mongoose';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    const errorMsg = 'MONGODB_URI is missing in environment variables. Check your .env.local file.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  if (cached!.conn) {
    console.log('Using cached MongoDB connection');
    return cached!.conn;
  }

  if (!cached!.promise) {
    console.log('Connecting to MongoDB...');
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached!.promise = mongoose.connect(uri, opts).then((mongoose) => {
      console.log('MongoDB connected successfully');
      return mongoose;
    }).catch(err => {
      console.error('MongoDB initial connection error:', err);
      cached!.promise = null; // Reset the promise so we can try again later
      throw err;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    console.error('MongoDB connection error:', e);
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default connectDB;
