"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import axiosClient from "@/lib/axiosclient";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Comment = {
  _id: string;
  slug: string;
  comment: string;
  username?: string;
  isOffensive?: boolean;
  createdAt: string;
};

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchComments = async (query?: string) => {
    setLoading(true);
    try {
      const url = query ? `/comment?q=${encodeURIComponent(query)}` : "/comment";
      const res = await axiosClient.get(url);
      setComments(res.data.comments || []);
    } catch (e) {
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const toggleOffensive = async (c: Comment) => {
    try {
      await axiosClient.put(`/comment/${c._id}`, { isOffensive: !c.isOffensive });
      setComments((prev) => prev.map((x) => (x._id === c._id ? { ...x, isOffensive: !c.isOffensive } : x)));
    } catch (e) {
      toast.error("Failed to update flag");
    }
  };

  const remove = async (id: string) => {
    try {
      await axiosClient.delete(`/comment/${id}`);
      setComments((prev) => prev.filter((x) => x._id !== id));
    } catch (e) {
      toast.error("Failed to delete");
    }
  };

  const filtered = useMemo(
    () =>
      comments.filter((c) =>
        [c.comment, c.slug, c.username].filter(Boolean).join(" ").toLowerCase().includes(q.toLowerCase())
      ),
    [comments, q]
  );

  return (
    <div className="p-4 md:p-6 space-y-4 bg-card rounded-2xl border border-border">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-lg md:text-2xl font-bold">Comments</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search comments, slug or user..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Button variant="outline" onClick={() => fetchComments(q)} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Comment</TableHead>
            <TableHead className="hidden md:table-cell">User</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((c) => (
            <TableRow key={c._id}>
              <TableCell className="max-w-[360px]">
                <span className="line-clamp-2">{c.comment}</span>
              </TableCell>
              <TableCell className="hidden md:table-cell">{c.username || "Anon"}</TableCell>
              <TableCell>
                <Link href={`/blog/${c.slug}`} className="text-primary hover:underline">
                  {c.slug}
                </Link>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {new Date(c.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {c.isOffensive ? (
                  <Badge variant="destructive">Flagged</Badge>
                ) : (
                  <Badge variant="secondary">OK</Badge>
                )}
              </TableCell>
              <TableCell className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => toggleOffensive(c)}>
                  {c.isOffensive ? "Unflag" : "Flag"}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => remove(c._id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
