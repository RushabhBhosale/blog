"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosClient from "@/lib/axiosclient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { extractFaqSchema, type FaqItem } from "@/lib/faq-schema";
type ListItem = {
  title: string;
  url?: string;
  description?: string;
  image?: string;
};

const SLUG_OPTIONS = { lower: true, strict: true, trim: true } as const;

const AdminEditBlogPage = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [author, setAuthor] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [slugLocked, setSlugLocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [enableFaqSchema, setEnableFaqSchema] = useState(false);
  const [faqs, setFaqs] = useState<FaqItem[]>([{ question: "", answer: "" }]);
  const [enableListSchema, setEnableListSchema] = useState(false);
  const [listItems, setListItems] = useState<ListItem[]>([
    { title: "", url: "", description: "", image: "" },
  ]);

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
      const { htmlWithoutFaqSchema, faqs: extractedFaqs } = extractFaqSchema(
        blog.content || "",
      );
      const storedFaqs = Array.isArray(blog.faqs) ? blog.faqs : [];
      const resolvedFaqs = storedFaqs?.length
        ? storedFaqs
        : extractedFaqs.length
          ? extractedFaqs
          : [{ question: "", answer: "" }];
      const shouldEnableFaq =
        typeof blog.enableFaqSchema === "boolean"
          ? blog.enableFaqSchema
          : resolvedFaqs.some((faq: any) => faq.question && faq.answer);

      setEnableFaqSchema(shouldEnableFaq);
      setFaqs(resolvedFaqs);
      setContent(htmlWithoutFaqSchema);
      setImageAlt(blog.imageAlt || "");
      setAuthor(blog.author);
      setSlugLocked(true);
      setNewSlug(blog.slug || "");
      // list schema
      const storedListItems = Array.isArray(blog.listItems)
        ? blog.listItems
        : [];
      setEnableListSchema(
        Boolean(blog.enableListSchema && storedListItems.length),
      );
      setListItems(
        storedListItems.length
          ? storedListItems
          : [{ title: "", url: "", description: "", image: "" }],
      );

      localStorage.setItem("html-content", htmlWithoutFaqSchema);
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

  const toggleFaqSchema = (checked: boolean) => {
    setEnableFaqSchema(checked);
    if (checked && faqs.length === 0) {
      setFaqs([{ question: "", answer: "" }]);
    }
  };

  const updateFaq = (index: number, field: keyof FaqItem, value: string) => {
    setFaqs((prev) =>
      prev.map((faq, i) => (i === index ? { ...faq, [field]: value } : faq)),
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
  const updateListItem = (
    index: number,
    field: keyof ListItem,
    value: string,
  ) => {
    setListItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, [field]: value } : it)),
    );
  };
  const addListItem = () =>
    setListItems((prev) => [
      ...prev,
      { title: "", url: "", description: "", image: "" },
    ]);
  const removeListItem2 = (index: number) =>
    setListItems((prev) =>
      prev.length <= 1
        ? [{ title: "", url: "", description: "", image: "" }]
        : prev.filter((_, i) => i !== index),
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const editorContent = window.localStorage.getItem("html-content") || "";
    if (!title || !category || !editorContent || !tags.length || !imageUrl) {
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
      await axiosClient.put(`/blog/${slug}`, {
        author,
        title,
        category,
        content: editorContent,
        tags,
        image: imageUrl,
        imageAlt,
        slug: newSlug,
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
                    onChange={(e) =>
                      updateFaq(index, "question", e.target.value)
                    }
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
                Tip: Type <code>[[ITEMLIST]]</code> where you want this list to
                appear. Or use <code>[[ITEMLIST:table]]</code>,{" "}
                <code>[[ITEMLIST:ol]]</code>, or <code>[[ITEMLIST:ul]]</code>.
              </p>
              {listItems.map((it, index) => (
                <div
                  key={index}
                  className="space-y-2 rounded-md border border-dashed p-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Item {index + 1}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={listItems.length <= 1}
                      onClick={() => removeListItem2(index)}
                    >
                      Remove
                    </Button>
                  </div>
                  <Input
                    placeholder="Title (required)"
                    value={it.title}
                    onChange={(e) =>
                      updateListItem(index, "title", e.target.value)
                    }
                  />
                  <Input
                    placeholder="URL (optional)"
                    value={it.url || ""}
                    onChange={(e) =>
                      updateListItem(index, "url", e.target.value)
                    }
                  />
                  <Textarea
                    placeholder="Description (optional)"
                    value={it.description || ""}
                    onChange={(e) =>
                      updateListItem(index, "description", e.target.value)
                    }
                    rows={3}
                  />
                  <Input
                    placeholder="Image URL (optional)"
                    value={it.image || ""}
                    onChange={(e) =>
                      updateListItem(index, "image", e.target.value)
                    }
                  />
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
          {loading ? "Updating..." : "Update Blog"}
        </Button>
      </form>
    </div>
  );
};

export default AdminEditBlogPage;
