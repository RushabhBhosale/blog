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
    imageAlt: { type: String },
    metaTitle: { type: String },
    metaDescription: { type: String },
    enableFaqSchema: { type: Boolean, default: false },
    faqs: {
      type: [
        {
          question: { type: String, required: true },
          answer: { type: String, required: true },
          _id: false,
        },
      ],
      default: [],
    },
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
