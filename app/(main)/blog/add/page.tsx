"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploader } from "@/components/ImageUploader";
import { useAuth } from "@/utils/useAuth";
import TailwindAdvancedEditor from "@/components/advanced-editor";
import Link from "next/link";

export default function AddBlogPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/category");
        setCategories(res.data.category || []);
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };
    fetchCategories();
  }, []);

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert("You must be signed in to add a blog");
      return;
    }

    setLoading(true);
    const editorContent = window.localStorage.getItem("html-content") || "";

    try {
      await axios.post(
        "/api/blog",
        {
          title,
          category,
          content: editorContent,
          tags,
          image: imageUrl,
          author: user?.name || user?.email,
        },
        { withCredentials: true }
      );

      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while creating blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      {/* {user?.id === blog.authorId && (
  <Link
    href={`/blog/edit/${blog._id}`}
    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
  >
    ✏️ Edit
  </Link>
)} */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-5xl font-bold border-none focus:outline-none placeholder:text-gray-400"
        />

        <ImageUploader onUpload={(url) => setImageUrl(url)} />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full py-2 px-3 rounded-md text-lg border border-gray-200 focus:outline-none"
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.title}>
              {cat.title}
            </option>
          ))}
        </select>

        <div>
          <Label className="block mb-2 font-medium">Tags</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {tag}
                <Button
                  className="size-4 m-0"
                  variant={"ghost"}
                  onClick={() => removeTag(tag)}
                >
                  <X className="w-3 h-3 cursor-pointer" />
                </Button>
              </Badge>
            ))}
          </div>
          <Input
            type="text"
            placeholder="Type a tag and press Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
          />
        </div>
        <div className="border rounded-lg shadow-sm">
          <TailwindAdvancedEditor />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full py-3 text-lg font-medium mt-4"
        >
          {loading ? "Posting..." : "Publish"}
        </Button>
      </form>
    </div>
  );
}
