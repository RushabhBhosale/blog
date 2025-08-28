"use client";
import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { BlogInterface } from "./page";

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

  const recentBlogs = useMemo(() => blogs?.slice(1, 4), [blogs]);
  const remainingBlogs = useMemo(() => blogs?.slice(4), [blogs]);

  return (
    <div className="min-h-screen bg-background">
      {/* Main Container */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - Takes 3 columns */}
          <div className="lg:col-span-3 space-y-12">
            {/* Featured Story Section */}
            {featuredBlog && (
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-foreground">
                      Featured Story
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Latest and trending
                    </p>
                  </div>
                  <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                    FEATURED
                  </span>
                </div>

                <Link
                  href={`/blog/${featuredBlog.slug}`}
                  className="block bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
                >
                  <div className="relative h-64 md:h-80">
                    <Image
                      src={featuredBlog.image}
                      alt={featuredBlog.title}
                      fill
                      priority
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full">
                          {featuredBlog.category}
                        </span>
                        <span className="text-xs text-white/90 font-medium">
                          {formatDate(featuredBlog.createdAt)}
                        </span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                        {featuredBlog.title}
                      </h1>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {featuredBlog.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs text-white/90 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                        {featuredBlog.tags.length > 3 && (
                          <span className="text-xs text-white/70">
                            +{featuredBlog.tags.length - 3} more
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-white/80 font-medium">
                        By {featuredBlog.author}
                      </p>
                    </div>
                  </div>
                </Link>
              </section>
            )}

            {/* Recent Posts Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">
                    Recent Posts
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Fresh content from our writers
                  </p>
                </div>
                <Link
                  href="/blogs"
                  className="text-sm text-primary font-medium bg-primary/5 px-4 py-2 rounded-full"
                >
                  View all →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {recentBlogs.map((blog) => (
                  <Link
                    key={blog._id}
                    href={`/blog/${blog.slug}`}
                    className="bg-card border border-border rounded-xl overflow-hidden shadow-sm"
                  >
                    <div className="relative h-48">
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
                          {blog.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-foreground mb-3 line-clamp-2 text-lg leading-tight">
                        {blog.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blog.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full"
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
                      <div className="flex items-center justify-between text-sm text-muted-foreground pt-3 border-t border-border">
                        <span className="font-medium">By {blog.author}</span>
                        <span>{formatDate(blog.createdAt)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* All Posts Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">
                    All Posts
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Explore our complete collection
                  </p>
                </div>
                <span className="bg-muted text-muted-foreground text-sm font-medium px-4 py-2 rounded-full">
                  {remainingBlogs.length} articles
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {remainingBlogs.map((blog) => (
                  <Link
                    key={blog._id}
                    href={`/blog/${blog.slug}`}
                    className="bg-card border border-border rounded-xl overflow-hidden shadow-sm"
                  >
                    <div className="relative h-44">
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
                          {blog.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-foreground mb-3 line-clamp-2 leading-tight">
                        {blog.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-3">
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
                      <div className="flex items-center justify-between text-sm text-muted-foreground pt-3 border-t border-border">
                        <span className="font-medium">By {blog.author}</span>
                        <span>{formatDate(blog.createdAt)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Newsletter Section */}
            <section className="mt-16">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-8 text-center">
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    Never Miss a Story
                  </h3>
                  <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                    Get the latest updates on travel adventures, anime insights,
                    and tech discoveries delivered straight to your inbox.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      className="flex-1 px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <button className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar - Takes 1 column */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-8">
              {/* Trending Blogs */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-primary rounded-full"></div>
                  <h3 className="text-xl font-bold text-foreground">
                    Trending Now
                  </h3>
                </div>

                <div>
                  {remainingBlogs.slice(0, 5).map((blog, index) => (
                    <Link
                      key={blog._id}
                      href={`/blog/${blog.slug}`}
                      className="flex gap-3 p-3 rounded-lg bg-muted/30"
                    >
                      <div className="relative w-12 h-15 rounded-lg overflow-hidden mb-2 border-2 border-border">
                        <Image
                          src={blog.image}
                          alt={blog.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground text-sm line-clamp-2 leading-tight mb-1">
                          {blog.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          By {blog.author}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-primary rounded-full"></div>
                  <h3 className="text-xl font-bold text-foreground">
                    Categories
                  </h3>
                </div>

                <div className="space-y-2">
                  {[...new Set(blogs.map((blog) => blog.category))]
                    .slice(0, 6)
                    .map((category) => {
                      const count = blogs.filter(
                        (blog) => blog.category === category
                      ).length;
                      return (
                        <div
                          key={category}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                        >
                          <span className="font-medium text-foreground">
                            {category}
                          </span>
                          <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
