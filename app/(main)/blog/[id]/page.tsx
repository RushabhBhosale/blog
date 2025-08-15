"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosClient from "@/lib/axiosclient";
import { BlogInterface } from "../../home/page";
import Link from "next/link";

const BlogDetails = () => {
  const [blog, setBlog] = useState<BlogInterface | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/blog/${id}`);
      const fetchedBlog = res.data.blog;
      setBlog(fetchedBlog);

      // Fetch related blogs using the dedicated API
      const relatedRes = await axiosClient.get(
        `/blog/related?category=${encodeURIComponent(
          fetchedBlog.category
        )}&excludeId=${id}`
      );
      setRelatedBlogs(relatedRes.data);
    } catch (err) {
      console.error("Error fetching blog:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!blog) return <div className="text-center py-20">Blog not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
      {/* Main Blog Content */}
      <div className="md:w-3/4 flex flex-col gap-6">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-96 object-cover rounded-xl shadow-lg"
        />

        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="px-2 py-1 bg-card/50 rounded-full">
            {blog.category}
          </span>
          <span>By {blog.author}</span>
          <span>{new Date(blog.createdAt!).toLocaleDateString()}</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          {blog.title}
        </h1>

        <div className="prose prose-slate max-w-full text-foreground">
          {blog.content.split("\n").map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-muted/30 text-muted-foreground rounded-full text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Right Sidebar: Related Blogs */}
      <div className="md:w-1/4 flex flex-col gap-4 sticky top-24 self-start">
        <h3 className="font-semibold text-lg mb-2">More in {blog.category}</h3>
        {relatedBlogs.length ? (
          relatedBlogs.map((b) => (
            <Link
              key={b._id}
              href={`/blog/${b._id}`}
              className="flex flex-col bg-card/70 border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <img
                src={b.image}
                alt={b.title}
                className="w-full h-24 object-cover"
              />
              <div className="p-2">
                <h4 className="text-sm font-medium text-foreground">
                  {b.title}
                </h4>
                <span className="text-xs text-muted-foreground">
                  By {b.author}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-xs text-muted-foreground">No related blogs.</p>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;
