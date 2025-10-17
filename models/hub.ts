import mongoose, { Schema, models, model } from "mongoose";

const HubSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    // Using category title as slug-equivalent in this project
    categorySlug: { type: String, required: true },
    description: { type: String },
    coverImage: { type: String },
  },
  { timestamps: true },
);

try {
  HubSchema.index({ categorySlug: 1 });
} catch (_) {}

export default models.Hub || model("Hub", HubSchema);
