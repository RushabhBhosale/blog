"use client";

import { useAuth } from "@/utils/useAuth";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import axiosClient from "@/lib/axiosclient";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

const DashBoardPage = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    blogs: 0,
    comments: 0,
    categories: 0,
    users: 0,
    subscribers: 0,
  });
  const [latestBlogs, setLatestBlogs] = useState<any[]>([]);
  const [latestComments, setLatestComments] = useState<any[]>([]);
  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      toast.error("User not authenticated to access this page");
      router.push("/home");
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated || user?.role !== "admin") return null;

  const load = async () => {
    try {
      const [b, c, cat, u, s] = await Promise.all([
        axiosClient.get("/blog"),
        axiosClient.get("/comment"),
        axiosClient.get("/category"),
        axiosClient.get("/user"),
        axiosClient
          .get("/subscriber")
          .catch(() => ({ data: { subscribers: [] } })),
      ]);
      setStats({
        blogs: (b.data.blogs || []).length,
        comments: (c.data.comments || []).length,
        categories: (cat.data.category || []).length,
        users: (u.data.users || []).length,
        subscribers: (s.data.subscribers || []).length,
      });
      setLatestBlogs((b.data.blogs || []).slice(0, 5));
      setLatestComments((c.data.comments || []).slice(0, 5));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Posts" value={stats.blogs} />
        <StatCard label="Comments" value={stats.comments} />
        <StatCard label="Categories" value={stats.categories} />
        <StatCard label="Users" value={stats.users} />
        <StatCard label="Subscribers" value={stats.subscribers} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Latest Posts</h2>
              <Link href="/admin/posts" className="text-primary text-sm">
                View all →
              </Link>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Category
                  </TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestBlogs.map((b) => (
                  <TableRow key={b._id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/blog/${b.slug}`}
                        className="hover:underline"
                      >
                        {b.title}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {b.category}
                    </TableCell>
                    <TableCell>
                      {new Date(b.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Latest Comments</h2>
              <Link href="/admin/comments" className="text-primary text-sm">
                Manage →
              </Link>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Comment</TableHead>
                  <TableHead className="hidden md:table-cell">Slug</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestComments.map((c: any) => (
                  <TableRow key={c._id}>
                    <TableCell className="truncate max-w-[240px]">
                      {c.comment}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Link
                        href={`/blog/${c.slug}`}
                        className="hover:underline text-primary"
                      >
                        {c.slug}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashBoardPage;

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="border border-border bg-card">
      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
