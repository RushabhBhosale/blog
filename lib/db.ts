import mongoose from "mongoose";

const MONGODB_URI =
  "mongodb+srv://admin:password1234@cluster0.frdfgmc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

if (!MONGODB_URI) throw new Error("Please add MONGODB_URI to .env");

// Global cached connection across hot reloads and server instances
let cached = (global as any).mongoose || { conn: null as any, promise: null as any };

if (!cached.promise) {
  cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
}

// Kick off connection eagerly at module load to avoid per-request awaits
(async () => {
  try {
    cached.conn = await cached.promise;
    (global as any).mongoose = cached;
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
})();

export async function connectDB() {
  // Kept for backwards-compatibility; resolves immediately after eager init
  if (cached.conn) return cached.conn;
  cached.conn = await cached.promise;
  (global as any).mongoose = cached;
  return cached.conn;
}
