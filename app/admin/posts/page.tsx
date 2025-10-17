"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosClient from "@/lib/axiosclient";

interface Post {
  _id: string;
  slug: string;
  title: string;
  category: string;
  status?: string;
  createdAt: string;
}

const PostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axiosClient("/blog");
      setPosts(res.data.blogs || []);
    };
    fetchPosts();
  }, []);

  const handleDelete = async (slug: string) => {
    await axiosClient(`/blog/${slug}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.slug !== slug));
  };

  const filtered = posts
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "category") return a.category.localeCompare(b.category);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="p-4 md:p-6 space-y-4 bg-white shadow-2xl/5 rounded-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-lg md:text-2xl font-bold">Recent Blogs</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="hidden md:block lg:w-50 xl:w-90"
          />

          <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="block md:hidden">
        <Input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </div>

      {posts?.length > 0 ? (
        <Table border={1}>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden">Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((post) => (
              <TableRow key={post._id}>
                <TableCell className="w-full truncate max-w-2xs">
                  {post.title}
                </TableCell>
                <TableCell className="hidden md:block">
                  {post.category}
                </TableCell>
                <TableCell>
                  {new Date(post.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Select
                    value={post.status || "Draft"}
                    onValueChange={async (val) => {
                      try {
                        await axiosClient.patch(`/blog/${post.slug}/status`, {
                          status: val,
                        });
                        setPosts((p) =>
                          p.map((x) =>
                            x._id === post._id ? { ...x, status: val } : x
                          )
                        );
                      } catch {
                        // ignore
                      }
                    }}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Published">Published</SelectItem>
                      <SelectItem value="Hide">Hide</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/posts/${post.slug}`}>Edit</Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(post.slug)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div>No blogs found</div>
      )}
    </div>
  );
};

export default PostsPage;
