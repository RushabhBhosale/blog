"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Hero from "./_components/Hero";
import axiosClient from "@/lib/axiosclient";

export interface BlogInterface {
  _id?: string;
  title: string;
  image: string;
  category: string;
  tags: string[];
  content: string;
  author?: string;
  createdAt?: string;
  likes: any;
  comment: any;
}

const Home = () => {
  const [blogs, setBlogs] = useState<BlogInterface[]>([]);
  const featuredBlog = blogs?.[0];

  useEffect(() => {
    getBlogs();
  }, []);

  const getBlogs = async () => {
    const allBlogs = await axiosClient.get("/blog");
    setBlogs(allBlogs.data.blogs);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <Hero />
      <div className="flex flex-col md:flex-row gap-6 mt-8 max-w-7xl mx-auto">
        {featuredBlog && (
          <Link
            href={`/blog/${featuredBlog._id}`}
            className="md:w-3/4 relative h-96 rounded-xl overflow-hidden shadow-lg"
          >
            <img
              src={featuredBlog.image}
              alt={featuredBlog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
              <span className="text-sm text-gray-200 mb-1">
                {featuredBlog.category}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                {featuredBlog.title}
              </h2>
              <p
                className="text-sm md:text-base text-gray-200 mt-2 line-clamp-3 novel-content"
                dangerouslySetInnerHTML={{ __html: featuredBlog.content }}
              />
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {featuredBlog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-black/70 bg-white/50 px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-300 mt-2">
                By {featuredBlog.author} • {formatDate(featuredBlog.createdAt)}
              </p>
            </div>
          </Link>
        )}

        <div className="md:w-1/4 flex flex-col gap-4">
          {blogs.slice(1).map((blog) => (
            <Link
              key={blog._id}
              href={`/blog/${blog._id}`}
              className="flex flex-col bg-card/70 border border-border rounded-lg overflow-hidden shadow-sm"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-32 object-cover"
              />
              <div className="p-3 flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">
                  {blog.category}
                </span>
                <h3 className="text-md font-semibold text-foreground">
                  {blog.title}
                </h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] text-muted-foreground bg-background px-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  By {blog.author} • {formatDate(blog.createdAt)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
