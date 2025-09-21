"use client";

import { useEffect, useMemo, useState } from "react";
import axiosClient from "@/lib/axiosclient";
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
import { toast } from "sonner";

type Category = { _id: string; title: string; createdAt: string };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [q, setQ] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await axiosClient.get("/category");
      setCategories(res.data.category || []);
    } catch (e) {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const add = async () => {
    const t = title.trim();
    if (!t) return;
    try {
      const res = await axiosClient.post("/category", { title: t });
      setCategories((p) => [res.data.category, ...p]);
      setTitle("");
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Failed to add category");
    }
  };

  const update = async (id: string, t: string) => {
    const title = t.trim();
    if (!title) return;
    try {
      const res = await axiosClient.put(`/category/${id}`, { title });
      setCategories((p) =>
        p.map((c) => (c._id === id ? res.data.category : c)),
      );
    } catch {
      toast.error("Failed to update");
    }
  };

  const remove = async (id: string) => {
    try {
      await axiosClient.delete(`/category/${id}`);
      setCategories((p) => p.filter((c) => c._id !== id));
    } catch {
      toast.error("Failed to delete");
    }
  };

  const filtered = useMemo(
    () =>
      categories.filter((c) => c.title.toLowerCase().includes(q.toLowerCase())),
    [categories, q],
  );

  return (
    <div className="space-y-4 p-4 md:p-6 bg-card rounded-2xl border border-border">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-lg md:text-2xl font-bold">Categories</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Filter..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="New category title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <Button onClick={add}>Add</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((c) => (
            <TableRow key={c._id}>
              <TableCell>
                <InlineEdit value={c.title} onSave={(v) => update(c._id, v)} />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {new Date(c.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(c._id)}
                >
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

function InlineEdit({
  value,
  onSave,
}: {
  value: string;
  onSave: (v: string) => void;
}) {
  const [v, setV] = useState(value);
  const [editing, setEditing] = useState(false);
  useEffect(() => setV(value), [value]);
  return editing ? (
    <div className="flex gap-2">
      <Input value={v} onChange={(e) => setV(e.target.value)} />
      <Button
        size="sm"
        onClick={() => {
          setEditing(false);
          onSave(v);
        }}
      >
        Save
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setV(value);
          setEditing(false);
        }}
      >
        Cancel
      </Button>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <span className="font-medium">{value}</span>
      <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
        Edit
      </Button>
    </div>
  );
}
