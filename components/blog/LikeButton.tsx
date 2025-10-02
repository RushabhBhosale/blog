"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/utils/useAuth";
import axiosClient from "@/lib/axiosclient";
import { toast } from "sonner";

type Props = {
  slug: string;
  initialLikes: string[];
};

export default function LikeButton({ slug, initialLikes }: Props) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState<number>(initialLikes.length);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCount(initialLikes.length);
    if (!user) {
      setLiked(false);
      return;
    }
    const isLiked = initialLikes.some(
      (id) => id?.toString() === user.userId?.toString(),
    );
    setLiked(isLiked);
  }, [user, initialLikes]);

  const toggleLike = async () => {
    if (!user) {
      toast.error("Sign in to like");
      return;
    }
    if (loading) return;
    const nextLiked = !liked;
    setLiked(nextLiked);
    setCount((prev) => Math.max(0, prev + (nextLiked ? 1 : -1)));
    setLoading(true);
    try {
      const res = await axiosClient.patch(`/blog/${slug}/likes`, {
        userId: user.userId,
      });
      setLiked(res.data.liked);
      if (typeof res.data.totalLikes === "number") {
        setCount(res.data.totalLikes);
      }
    } catch (err: any) {
      setLiked(!nextLiked);
      setCount((prev) => Math.max(0, prev + (nextLiked ? -1 : 1)));
      toast.error(err?.response?.data?.error || "Failed to update like");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={toggleLike}
      disabled={loading}
      className="flex items-center gap-2"
    >
      <Heart
        size={16}
        className={liked ? "fill-red-500 text-red-500" : "text-foreground"}
      />
      <span className="text-sm">{count}</span>
    </Button>
  );
}
