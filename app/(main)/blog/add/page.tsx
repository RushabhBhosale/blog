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

    try {
      await axios.post(
        "/api/blog",
        {
          title,
          category,
          content,
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
    <div className="max-w-2xl md:mx-auto m-4 md:my-12 py-4 px-5 md:p-8 rounded-2xl bg-white shadow-2xl/5">
      <h1 className="text-2xl font-bold mb-6">Add New Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title" className="mb-1">
            Title
          </Label>
          <Input
            id="title"
            placeholder="Enter blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="category" className="mb-1">
            Category
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat._id} value={cat.title}>
                  {cat.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="tags" className="mb-1">
            Tags
          </Label>
          <Input
            id="tags"
            placeholder="Type a tag and press Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {tag}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeTag(tag)}
                >
                  <X />
                </Button>
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="image" className="mb-1">
            Upload Image
          </Label>
          <ImageUploader onUpload={(url) => setImageUrl(url)} />
          <input type="hidden" name="image" value={imageUrl} />
        </div>

        <div>
          <Label htmlFor="content" className="mb-1">
            Content
          </Label>
          <Textarea
            id="content"
            placeholder="Write your blog content..."
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <TailwindAdvancedEditor />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post Blog"}
        </Button>
      </form>
    </div>
  );
}
