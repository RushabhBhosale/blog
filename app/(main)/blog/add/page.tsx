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
import { type FaqItem } from "@/lib/faq-schema";
type ListItem = { title: string; url?: string; description?: string; image?: string };

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
  const [enableFaqSchema, setEnableFaqSchema] = useState(false);
  const [faqs, setFaqs] = useState<FaqItem[]>([{ question: "", answer: "" }]);
  const [enableListSchema, setEnableListSchema] = useState(false);
  const [listItems, setListItems] = useState<ListItem[]>([{ title: "", url: "", description: "", image: "" }]);

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

  const toggleFaqSchema = (checked: boolean) => {
    setEnableFaqSchema(checked);
    if (checked && faqs.length === 0) {
      setFaqs([{ question: "", answer: "" }]);
    }
  };

  const updateFaq = (index: number, field: keyof FaqItem, value: string) => {
    setFaqs((prev) =>
      prev.map((faq, i) => (i === index ? { ...faq, [field]: value } : faq))
    );
  };

  const addFaq = () => {
    setFaqs((prev) => [...prev, { question: "", answer: "" }]);
  };

  const removeFaq = (index: number) => {
    setFaqs((prev) => {
      if (prev.length <= 1) {
        return [{ question: "", answer: "" }];
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const toggleListSchema = (checked: boolean) => {
    setEnableListSchema(checked);
    if (checked && listItems.length === 0) {
      setListItems([{ title: "", url: "", description: "", image: "" }]);
    }
  };

  const updateListItem = (index: number, field: keyof ListItem, value: string) => {
    setListItems((prev) => prev.map((it, i) => (i === index ? { ...it, [field]: value } : it)));
  };

  const addListItem = () => {
    setListItems((prev) => [...prev, { title: "", url: "", description: "", image: "" }]);
  };

  const removeListItem = (index: number) => {
    setListItems((prev) => (prev.length <= 1 ? [{ title: "", url: "", description: "", image: "" }] : prev.filter((_, i) => i !== index)));
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

    const sanitizedFaqs = faqs
      .map((faq) => ({
        question: faq.question.trim(),
        answer: faq.answer.trim(),
      }))
      .filter((faq) => faq.question && faq.answer);

    if (enableFaqSchema && sanitizedFaqs.length === 0) {
      toast.error("Add at least one FAQ with both question and answer.");
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
          enableFaqSchema,
          faqs: sanitizedFaqs,
          enableListSchema,
          listItems: listItems
            .map((i) => ({
              title: i.title.trim(),
              url: (i.url || "").trim(),
              description: (i.description || "").trim(),
              image: (i.image || "").trim(),
            }))
            .filter((i) => i.title),
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

        <div className="border rounded-lg p-4 space-y-4">
          <label className="flex items-center gap-3 text-sm font-medium">
            <input
              type="checkbox"
              checked={enableFaqSchema}
              onChange={(e) => toggleFaqSchema(e.target.checked)}
              className="size-4"
            />
            Enable FAQ Schema
          </label>

          {enableFaqSchema && (
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="space-y-2 rounded-md border border-dashed p-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">FAQ {index + 1}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={faqs.length <= 1}
                      onClick={() => removeFaq(index)}
                    >
                      Remove
                    </Button>
                  </div>
                  <Input
                    placeholder="Question"
                    value={faq.question}
                    onChange={(e) => updateFaq(index, "question", e.target.value)}
                  />
                  <Textarea
                    placeholder="Answer"
                    value={faq.answer}
                    onChange={(e) => updateFaq(index, "answer", e.target.value)}
                    rows={4}
                  />
                </div>
              ))}

              <Button type="button" variant="outline" onClick={addFaq}>
                Add FAQ
              </Button>
            </div>
          )}
        </div>

        <div className="border rounded-lg p-4 space-y-4">
          <label className="flex items-center gap-3 text-sm font-medium">
            <input
              type="checkbox"
              checked={enableListSchema}
              onChange={(e) => toggleListSchema(e.target.checked)}
              className="size-4"
            />
            Enable List/Ranking Schema
          </label>

          {enableListSchema && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Tip: Type <code>[[ITEMLIST]]</code> where you want this list to appear.
                You can also use <code>[[ITEMLIST:table]]</code>, <code>[[ITEMLIST:ol]]</code>, or <code>[[ITEMLIST:ul]]</code> for different layouts.
              </p>
              {listItems.map((it, index) => (
                <div key={index} className="space-y-2 rounded-md border border-dashed p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Item {index + 1}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={listItems.length <= 1}
                      onClick={() => removeListItem(index)}
                    >
                      Remove
                    </Button>
                  </div>
                  <Input placeholder="Title (required)" value={it.title} onChange={(e) => updateListItem(index, "title", e.target.value)} />
                  <Input placeholder="URL (optional)" value={it.url || ""} onChange={(e) => updateListItem(index, "url", e.target.value)} />
                  <Textarea placeholder="Description (optional)" value={it.description || ""} onChange={(e) => updateListItem(index, "description", e.target.value)} rows={3} />
                  <Input placeholder="Image URL (optional)" value={it.image || ""} onChange={(e) => updateListItem(index, "image", e.target.value)} />
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addListItem}>
                Add Item
              </Button>
            </div>
          )}
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
