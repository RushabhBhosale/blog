import mongoose, { Schema, models, model } from "mongoose";

  const miniSparkSchema = new Schema(
    {
      title: { type: String, required: true },
      slug: { type: String, required: true, unique: true },
      content: { type: String, required: true }, // short HTML or text
    kind: { type: String, enum: ["movie", "travel", "thoughts", "other"], default: "other" },
      // For kind === "movie": specify if it's a film or a TV/OTT series
      format: { type: String, enum: ["movie", "tvseries"], default: undefined },
      // Optional language tag, free-form but typically from a fixed set
      language: { type: String },
      rating: { type: Number, min: 1, max: 10 },
      location: { type: String },
    tags: { type: [String], default: [] },
    verdict: { type: String },
      author: { type: String },
      authorId: { type: String },
      image: { type: String },
      imageAlt: { type: String },
    },
  { timestamps: true },
);

  try {
    miniSparkSchema.index({ slug: 1 }, { unique: true });
    miniSparkSchema.index({ kind: 1, createdAt: -1 });
    miniSparkSchema.index({ format: 1, createdAt: -1 });
    miniSparkSchema.index({ language: 1 });
  } catch {}

// Reset model in dev to pick up schema changes
try {
  if (process.env.NODE_ENV !== "production" && (mongoose.models as any)?.MiniSpark) {
    delete (mongoose.models as any).MiniSpark;
  }
} catch {}

export default models.MiniSpark || model("MiniSpark", miniSparkSchema);
