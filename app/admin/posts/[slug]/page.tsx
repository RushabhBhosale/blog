"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosClient from "@/lib/axiosclient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { ImageUploader } from "@/components/ImageUploader";
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

const AdminEditBlogPage = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [author, setAuthor] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [slugLocked, setSlugLocked] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  useEffect(() => {
    if (slug) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    if (!slugLocked) {
      setNewSlug(slugify(title || "", SLUG_OPTIONS));
    }
  }, [title, slugLocked]);

  const fetchData = async () => {
    try {
      const [catRes, blogRes] = await Promise.all([
        axiosClient.get("/category"),
        axiosClient.get(`/blog/${slug}`),
      ]);

      setCategories(catRes.data.category || []);

      const blog = blogRes.data.blog;
      if (!blog) {
        toast.error("Blog not found");
        router.push("/admin/posts");
        return;
      }

      setTitle(blog.title);
      setCategory(blog.category);
      setTags(blog.tags || []);
      setImageUrl(blog.image || "");
      setContent(blog.content);
      setAuthor(blog.author);
      setSlugLocked(true);
      setNewSlug(blog.slug || "");
      localStorage.setItem("html-content", blog.content);
    } catch (err) {
      console.error(err);
      toast.error("Error loading blog");
      router.push("/admin/posts");
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

    setLoading(true);
    const editorContent = window.localStorage.getItem("html-content") || "";
    if (!title || !category || !editorContent || !tags.length || !imageUrl) {
      toast.error("Please fill all the required fields");
      setLoading(false);
      return;
    }

    try {
      await axiosClient.put(`/blog/${slug}`, {
        author,
        title,
        category,
        content: editorContent,
        tags,
        image: imageUrl,
        slug: newSlug,
      });

      toast.success("Blog updated successfully");
      router.push("/admin/posts");
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

        <ImageUploader onUpload={(url) => setImageUrl(url)} initialUrl={imageUrl} />

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
};

export default AdminEditBlogPage;
