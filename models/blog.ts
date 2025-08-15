import mongoose, { Schema, model, models } from "mongoose";

const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    author: { type: String, required: true },
    tags: { type: [String] },
    image: { type: String },
  },
  { timestamps: true }
);

export default models.Blog || model("Blog", blogSchema);
