"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/lib/axiosclient";
import { useAuth } from "@/utils/useAuth";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/ImageUploader";
import { toast } from "sonner";

type ProfileResponse = {
  profile: {
    userId: string;
    email: string;
    name: string;
    username: string;
    headline: string;
    bio: string;
    location: string;
    website: string;
    imageUrl: string;
    socials: Record<string, string>;
  };
};

const socialFields = [
  { key: "twitter", label: "Twitter / X" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "github", label: "GitHub" },
  { key: "instagram", label: "Instagram" },
  { key: "youtube", label: "YouTube" },
] as const;

export default function ProfilePage() {
  const { user, loading, fetchUser } = useAuth();
  const router = useRouter();

  const [initializing, setInitializing] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [socials, setSocials] = useState<Record<string, string>>({});

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setInitializing(false);
      router.replace("/signin");
      return;
    }

    const loadProfile = async () => {
      try {
        const res = await axiosClient.get<ProfileResponse>("/profile");
        const profile = res.data.profile;
        setName(profile.name ?? "");
        setUsername(profile.username ?? "");
        setHeadline(profile.headline ?? "");
        setBio(profile.bio ?? "");
        setLocation(profile.location ?? "");
        setWebsite(profile.website ?? "");
        setImageUrl(profile.imageUrl ?? "");
        setSocials(profile.socials ?? {});
      } catch (err) {
        console.error("Failed to load profile", err);
        toast.error("Unable to load profile. Please try again.");
      } finally {
        setInitializing(false);
      }
    };

    loadProfile();
  }, [loading, user, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      await axiosClient.put("/profile", {
        name,
        username,
        headline,
        bio,
        location,
        website,
        imageUrl,
        socials,
      });
      toast.success("Profile updated");
      fetchUser();
    } catch (error: any) {
      const message =
        error?.response?.data?.error || "Failed to update profile";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (initializing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <p className="text-muted-foreground text-sm">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Your profile</h1>
        <p className="mt-2 text-muted-foreground">
          Update the details readers see on your author pages and bylines.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Basic details
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Full name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Username
              </label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="janedoe"
                autoComplete="off"
              />
              <p className="text-xs text-muted-foreground">
                Usernames are lowercase, 3-30 characters. Readers visit you at{" "}
                <code className="rounded bg-muted px-1">
                  /author/{username || "your-username"}
                </code>
                .
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Headline
            </label>
            <Input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Anime critic & travel storyteller"
              maxLength={140}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Bio
            </label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Share your background, beats, and what inspires you."
              rows={5}
              maxLength={600}
            />
            <p className="text-xs text-muted-foreground">
              {bio.length}/600 characters
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Contact & presence
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Location
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Mumbai, India"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Website
              </label>
              <Input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://"
                inputMode="url"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {socialFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  {field.label}
                </label>
                <Input
                  value={socials[field.key] || ""}
                  onChange={(e) =>
                    setSocials((prev) => ({
                      ...prev,
                      [field.key]: e.target.value,
                    }))
                  }
                  placeholder={
                    field.key === "twitter" ? "@handle" : "https://"
                  }
                />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Profile photo
          </h2>
          <div className="space-y-3">
            <ImageUploader
              onUpload={(url) => setImageUrl(url)}
              initialUrl={imageUrl}
            />
            <p className="text-xs text-muted-foreground">
              For best results, upload a square image at least 400×400px.
            </p>
          </div>
        </section>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save profile"}
          </Button>
        </div>
      </form>
    </div>
  );
}
