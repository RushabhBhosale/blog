"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { ImageUploader } from "@/components/ImageUploader";
import { useAuth } from "@/utils/useAuth";
import TailwindAdvancedEditor from "@/components/advanced-editor";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import slugify from "slugify";

const SLUG_OPTIONS = { lower: true, strict: true, trim: true } as const;

export default function EditBlogPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [slugLocked, setSlugLocked] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (slug && user) fetchData();
  }, [slug, user, router]);

  useEffect(() => {
    if (!slugLocked) {
      setNewSlug(slugify(title || "", SLUG_OPTIONS));
    }
  }, [title, slugLocked]);

  const fetchData = async () => {
    try {
      const [catRes, blogRes] = await Promise.all([
        axios.get("/api/category"),
        axios.get(`/api/blog/${slug}`),
      ]);

      setCategories(catRes.data.category || []);

      const blog = blogRes.data.blog;
      if (!blog) {
        toast.error("Blog not found");
        router.push("/");
        return;
      }

      if (user && blog.authorId !== user.userId) {
        toast.error("You can only edit your own blogs");
        router.push("/");
        return;
      }

      setTitle(blog.title);
      setCategory(blog.category);
      setTags(blog.tags || []);
      setImageUrl(blog.image || "");
      setImageAlt(blog.imageAlt || "");
      setContent(blog.content);
      setMetaTitle(blog.metaTitle || "");
      setMetaDescription(blog.metaDescription || "");
      setSlugLocked(true);
      setNewSlug(blog.slug || "");
      localStorage.setItem("html-content", blog.content);
    } catch (err) {
      console.error(err);
      toast.error("Error loading blog");
      router.push("/");
    }
  };

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
      toast.error("You must be signed in to edit a blog");
      return;
    }

    setLoading(true);
    const editorContent = window.localStorage.getItem("html-content") || "";
    if (!title || !category || !editorContent || !tags.length || !imageUrl) {
      toast.error("Please fill all the required fields");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.put(
        `/api/blog/${slug}`,
        {
          author: user.name,
          title,
          category,
          content: editorContent,
          tags,
          image: imageUrl,
          imageAlt,
          metaTitle,
          metaDescription,
          slug: newSlug,
        },
        { withCredentials: true }
      );

      toast.success("Blog updated successfully");
      const formattedSlug = data?.blog?.slug || newSlug || slug;
      router.push(`/blog/${formattedSlug}`);
    } catch (err) {
      console.error(err);
      toast.error("Error updating blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-5xl font-bold border-none focus:outline-none placeholder:text-gray-400"
        />

        <Input
          type="text"
          placeholder="Slug"
          value={newSlug}
          onChange={(e) => {
            const formatted = slugify(e.target.value, SLUG_OPTIONS);
            setNewSlug(formatted);
            setSlugLocked(formatted.length > 0);
          }}
          onBlur={() => {
            if (!newSlug.length) {
              setSlugLocked(false);
            }
          }}
        />

        <Input
          type="text"
          placeholder="Meta Title"
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
        />

        <Textarea
          placeholder="Meta Description"
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
        />

        {/* Image Upload */}
        <ImageUploader
          onUpload={(url) => setImageUrl(url)}
          initialUrl={imageUrl}
        />
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
            placeholder="Type a tag and press Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
          />
        </div>

        <div>
          <TailwindAdvancedEditor isEdit={true} editContent={content} />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full py-3 text-lg font-medium mt-4"
        >
          {loading ? "Updating..." : "Update Blog"}
        </Button>
      </form>
    </div>
  );
}
