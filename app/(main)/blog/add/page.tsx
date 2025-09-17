"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { toast } from "sonner";
import slugify from "slugify";

const SLUG_OPTIONS = { lower: true, strict: true, trim: true } as const;

export default function AddBlogPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [slugLocked, setSlugLocked] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    console.log("ys", user);
  }, [user]);

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

  useEffect(() => {
    if (!slugLocked) {
      setSlug(slugify(title || "", SLUG_OPTIONS));
    }
  }, [title, slugLocked]);

  const norm = (s: string) => s.trim().replace(/^#+/, "");
  const tokenize = (s: string) => s.split("#").map(norm).filter(Boolean);

  const addTags = (raw: string) => {
    const incoming = tokenize(raw);
    if (!incoming.length) return;
    const existingSet = new Set(tags.map((t) => t.toLowerCase()));
    const merged: string[] = [...tags];
    for (const t of incoming) {
      if (!existingSet.has(t.toLowerCase())) {
        existingSet.add(t.toLowerCase());
        merged.push(t);
      }
    }
    setTags(merged);
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (tagInput.trim()) {
        addTags(tagInput);
        setTagInput("");
      }
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
    if (!title || !category || !editorContent || !tags || !imageUrl || !user) {
      toast.error("Please fill all the required fields");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        "/api/blog",
        {
          title,
          slug,
          category,
          content: editorContent,
          tags,
          image: imageUrl,
          imageAlt,
          metaTitle,
          metaDescription,
          author: user?.name || user?.email,
          authorId: user?.userId,
        },
        { withCredentials: true }
      );

      router.push("/");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-5xl font-bold border-none focus:outline-none placeholder:text-gray-400"
        />

        <Input
          type="text"
          placeholder="Meta Title"
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
        />

        <Input
          type="text"
          placeholder="Slug"
          value={slug}
          onChange={(e) => {
            const formatted = slugify(e.target.value, SLUG_OPTIONS);
            setSlug(formatted);
            setSlugLocked(formatted.length > 0);
          }}
          onBlur={() => {
            if (!slug.length) {
              setSlugLocked(false);
            }
          }}
        />

        <Textarea
          placeholder="Meta Description"
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
        />

        <ImageUploader onUpload={(url) => setImageUrl(url)} />
        <Input
          type="text"
          placeholder="Image alt text (for accessibility/SEO)"
          value={imageAlt}
          onChange={(e) => setImageAlt(e.target.value)}
        />

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat._id} value={cat.title}>
                {cat.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div>
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
                  type="button"
                >
                  <X className="w-3 h-3 cursor-pointer" />
                </Button>
              </Badge>
            ))}
          </div>
          <input
            className="border-0 shadow-none border-b rounded-none w-full outline-none"
            type="text"
            placeholder="Type tags (e.g. #react #nextjs, ui design) and press Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            onBlur={() => {
              if (tagInput.trim()) {
                addTags(tagInput);
                setTagInput("");
              }
            }}
            onPaste={(e) => {
              e.preventDefault();
              const text = e.clipboardData.getData("text");
              addTags(text);
              setTagInput("");
            }}
          />
        </div>
        <div>
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
