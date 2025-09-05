import mongoose, { Schema, model, models } from "mongoose";

const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    author: { type: String, required: true },
    authorId: { type: String, required: true },
    tags: { type: [String] },
    image: { type: String },
    metaTitle: { type: String },
    metaDescription: { type: String },
    status: { type: String, enum: ["Draft", "Published", "Pending", "Hide"] },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true }
);

export default models.Blog || model("Blog", blogSchema);
