export const defaultEditorContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      attrs: { level: 4 },
      content: [
        { type: "text", text: "Start writing your blog with fresh idea" },
      ],
    },
  ],
};

// DB helpers for blog + hub
import "@/lib/db"; // initialize DB
import Hub from "@/models/hub";
import Blog from "@/models/blog";

export async function getBlogBySlug(slug: string) {
  return Blog.findOne({ slug }).lean();
}

export async function getPostsByHub(categorySlug: string, hubSlug: string) {
  const hub = await Hub.findOne({ slug: hubSlug, categorySlug }).lean();
  const posts = await Blog.find({
    "hub.slug": hubSlug,
    category: new RegExp(`^${categorySlug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
    status: { $ne: "Hide" },
  })
    .sort({ createdAt: -1 })
    .select("title slug category hub")
    .lean();
  return { hub, posts } as const;
}
