"use client";
import React, { useState } from "react";
import { BlogInterface } from "./page";
import Link from "next/link";
import Hero from "./_components/Hero";

type Props = {
  allblogs: BlogInterface[];
};

const HomePage = ({ allblogs }: Props) => {
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
        <div className="hidden">
          <Hero />
        </div>

        {featuredBlog && (
          <section className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Featured Story
              </h2>
              <span className="text-sm text-muted-foreground">Latest</span>
            </div>
            <Link
              href={`/blog/${featuredBlog.slug}`}
              className="block relative h-64 md:h-96 rounded-xl overflow-hidden shadow-xl"
            >
              <img
                src={featuredBlog.image}
                alt={featuredBlog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    {featuredBlog.category}
                  </span>
                  <span className="text-xs text-white/80">
                    {formatDate(featuredBlog.createdAt)}
                  </span>
                </div>
                <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                  {featuredBlog.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                  {featuredBlog.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-white/80 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-white/70 mt-3">
                  By {featuredBlog.author}
                </p>
              </div>
            </Link>
          </section>
        )}

        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Recent Posts
            </h2>
            <Link
              href="/blogs"
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentBlogs.map((blog) => (
              <Link
                key={blog._id}
                href={`/blog/${blog.slug}`}
                className="bg-card border border-border rounded-lg overflow-hidden shadow-sm"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-primary/90 text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full">
                      {blog.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                    {blog.title}
                  </h3>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {blog.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>By {blog.author}</span>
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              All Posts
            </h2>
            <span className="text-sm text-muted-foreground">
              {remainingBlogs.length} articles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {remainingBlogs.map((blog) => (
              <Link
                key={blog._id}
                href={`/blog/${blog.slug}`}
                className="bg-card border border-border rounded-lg overflow-hidden shadow-sm"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-primary/90 text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full">
                      {blog.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                    {blog.title}
                  </h3>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {blog.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                    {blog.tags.length > 2 && (
                      <span className="text-xs text-muted-foreground">
                        +{blog.tags.length - 2} more
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>By {blog.author}</span>
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16 mb-12">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Never Miss a Story
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Get the latest updates on travel adventures, anime insights, and
              tech discoveries delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
