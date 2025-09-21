import mongoose, { Schema, model, models } from "mongoose";

const HubSubSchema = new Schema(
  {
    slug: { type: String },
    title: { type: String },
  },
  { _id: false },
);

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
    // Optional structured list/ranking support
    enableListSchema: { type: Boolean, default: false },
    listItems: {
      type: [
        {
          title: { type: String, required: true },
          url: { type: String },
          description: { type: String },
          image: { type: String },
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
    // Optional hub association
    hub: { type: HubSubSchema, default: undefined },
  },
  { timestamps: true },
);

// Indexes to speed up common queries
// - Unique index on slug for fast lookup by slug
// - Index on category and tags to accelerate related posts queries
// - Text index to help any text-based search if used elsewhere
try {
  blogSchema.index({ slug: 1 }, { unique: true });
  blogSchema.index({ category: 1 });
  blogSchema.index({ tags: 1 });
  blogSchema.index({ "hub.slug": 1 });
  blogSchema.index({
    title: "text",
    metaTitle: "text",
    metaDescription: "text",
    content: "text",
  });
} catch (_) {
  // In case indexes are registered multiple times in dev reloads
}

// In Next.js dev, model definitions can be cached across reloads.
// Ensure the latest schema is used by recreating the model in dev.
try {
  if (process.env.NODE_ENV !== "production" && (mongoose.models as any)?.Blog) {
    delete (mongoose.models as any).Blog;
  }
} catch {}

export default models.Blog || model("Blog", blogSchema);
