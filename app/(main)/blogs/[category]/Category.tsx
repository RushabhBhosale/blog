"use client";

import React from "react";
import Link from "next/link";
import { BlogInterface } from "./page";

type Props = {
  allblogs: BlogInterface[];
  category: string;
};

const CategoryPage = ({ allblogs, category }: Props) => {
  const blogs = allblogs;
  const featuredBlog = blogs?.[0];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const recentBlogs = blogs?.slice(1, 4);
  const remainingBlogs = blogs?.slice(4);

  return (
    <div className="min-h-screen background">
      <div className="px-3 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mt-6">
          {category.toUpperCase()} Blogs
        </h1>

        {/* Featured Blog */}
        {featuredBlog && (
          <section className="mt-8">
            <Link
              href={`/blog/${featuredBlog.slug}`}
              className="block relative h-64 md:h-96 rounded-xl overflow-hidden shadow-xl"
            >
              <img
                src={featuredBlog.image}
                alt={featuredBlog.imageAlt || featuredBlog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  {featuredBlog.category}
                </span>
                <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-white mt-2">
                  {featuredBlog.title}
                </h2>
              </div>
            </Link>
          </section>
        )}

        {/* Recent Blogs */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Recent Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentBlogs.map((blog) => (
              <Link
                key={blog._id}
                href={`/blog/${blog.slug}`}
                className="bg-card border border-border rounded-lg overflow-hidden shadow-sm"
              >
                <div className="h-48">
                  <img
                    src={blog.image}
                    alt={blog.imageAlt || blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold line-clamp-2">{blog.title}</h3>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(blog.createdAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* All Blogs */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">All {category} Blogs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {remainingBlogs.map((blog) => (
              <Link
                key={blog._id}
                href={`/blog/${blog.slug}`}
                className="bg-card border border-border rounded-lg overflow-hidden shadow-sm"
              >
                <div className="h-40">
                  <img
                    src={blog.image}
                    alt={blog.imageAlt || blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold line-clamp-2">{blog.title}</h3>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(blog.createdAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CategoryPage;
