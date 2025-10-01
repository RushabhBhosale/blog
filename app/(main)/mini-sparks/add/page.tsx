"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import slugify from "slugify";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/utils/useAuth";
import { toast } from "sonner";
import { ImageUploader } from "@/components/ImageUploader";

const SLUG = { lower: true, strict: true, trim: true } as const;

export default function AddMiniSparkPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [kind, setKind] = useState("movie");
  const [rating, setRating] = useState("");
  const [location, setLocation] = useState("");
  const [format, setFormat] = useState("movie");
  const [language, setLanguage] = useState("English");
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [image, setImage] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  useEffect(() => {
    setSlug(slugify(title || "", SLUG));
  }, [title]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error("Sign in to post");
    if (!title || !content) return toast.error("Title and content required");
    const wc = content
      .replace(/<[^>]+>/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    if (wc < 20) {
      toast.error("Too short review");
      return;
    }
    try {
      setPosting(true);
      const body: any = { title, slug, content, kind };
      if (location) body.location = location;
      if (rating !== "" && kind === "movie") body.rating = Number(rating);
      if (kind === "movie") {
        if (format) body.format = format;
        if (language) body.language = language;
      }
      if (image) body.image = image;
      if (imageAlt) body.imageAlt = imageAlt;
      await axios.post("/api/minispark", body, { withCredentials: true });
      toast.success("Mini Spark posted");
      router.push("/mini-sparks");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to post");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Write a Mini Spark</h1>
      <form onSubmit={submit} className="space-y-4">
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select value={kind} onValueChange={setKind}>
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="movie">Movie</SelectItem>
              <SelectItem value="travel">Travel</SelectItem>
              <SelectItem value="thoughts">Thoughts</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Location (optional)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Input
            placeholder="Rating"
            type="text"
            inputMode="decimal"
            value={rating}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d*\.?\d*$/.test(val)) {
                setRating(val);
              }
            }}
            disabled={kind !== "movie"}
          />
        </div>
        {kind === "movie" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="movie">Movie</SelectItem>
                <SelectItem value="tvseries">TV Series</SelectItem>
              </SelectContent>
            </Select>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Hindi">Hindi</SelectItem>
                <SelectItem value="Marathi">Marathi</SelectItem>
                <SelectItem value="Tamil">Tamil</SelectItem>
                <SelectItem value="Telugu">Telugu</SelectItem>
                <SelectItem value="Malayalam">Malayalam</SelectItem>
                <SelectItem value="Kannada">Kannada</SelectItem>
                <SelectItem value="Bengali">Bengali</SelectItem>
                <SelectItem value="Gujarati">Gujarati</SelectItem>
                <SelectItem value="Japanese">Japanese</SelectItem>
                <SelectItem value="Korean">Korean</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="German">German</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="space-y-2">
          <ImageUploader onUpload={(url) => setImage(url)} />
          <Input
            placeholder="Image alt text (optional)"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
          />
        </div>
        <Textarea
          placeholder="Your short review / experience (100–250 words). You can paste plain text or simple HTML."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
        />
        <Button type="submit" disabled={posting} className="w-full">
          {posting ? "Posting..." : "Publish Mini Spark"}
        </Button>
      </form>
    </div>
  );
}
