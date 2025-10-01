"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/utils/useAuth";
import { toast } from "sonner";
import { ImageUploader } from "@/components/ImageUploader";

export default function EditMiniSparkPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const allowedEmail = "rushabhbhosale25757@gmail.com";
  const isAllowed = (user?.email || "").toLowerCase() === allowedEmail.toLowerCase();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState("movie");
  const [format, setFormat] = useState("movie");
  const [language, setLanguage] = useState("English");
  const [rating, setRating] = useState<string>("");
  const [location, setLocation] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!isAllowed) {
      router.replace("/mini-sparks");
      return;
    }
    (async () => {
      try {
        const { data } = await axios.get(`/api/minispark/${encodeURIComponent(slug)}`);
        const it = data?.item || {};
        setTitle(it.title || "");
        setKind(it.kind || "movie");
        setFormat(it.format || "movie");
        setLanguage(it.language || "English");
        setRating(typeof it.rating === "number" ? String(it.rating) : "");
        setLocation(it.location || "");
        setContent(it.content || "");
        setImage(it.image || "");
        setImageAlt(it.imageAlt || "");
      } catch {
        toast.error("Failed to load Mini Spark");
        router.replace("/mini-sparks");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug, isAuthenticated, isAllowed, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/api/minispark/${encodeURIComponent(slug)}`, {
        title,
        kind,
        format: kind === "movie" ? format : undefined,
        language: kind === "movie" ? language : undefined,
        rating: rating ? Number(rating) : undefined,
        location,
        content,
        image,
        imageAlt,
      }, { withCredentials: true });
      toast.success("Mini Spark updated");
      router.push(`/mini-sparks/${encodeURIComponent(slug)}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update");
    }
  };

  if (!isAuthenticated || !isAllowed) return null;
  if (loading) return <div className="max-w-2xl mx-auto px-4 py-10">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Edit Mini Spark</h1>
      <form onSubmit={submit} className="space-y-4">
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select value={kind} onValueChange={setKind}>
            <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
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
            placeholder="Rating 1–10"
            type="text"
            inputMode="decimal"
            value={rating}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d*\.?\d*$/.test(val)) setRating(val);
            }}
            disabled={kind !== "movie"}
          />
        </div>
        {kind === "movie" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger><SelectValue placeholder="Format" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="movie">Movie</SelectItem>
                <SelectItem value="tvseries">TV Series</SelectItem>
              </SelectContent>
            </Select>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger><SelectValue placeholder="Language" /></SelectTrigger>
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
          <Input placeholder="Image alt text (optional)" value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} />
        </div>
        <Textarea
          placeholder="Your short review / experience"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
        />
        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  );
}

