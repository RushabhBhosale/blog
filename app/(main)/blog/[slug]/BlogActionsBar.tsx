"use client";

import Link from "next/link";
import LikeButton from "@/components/blog/LikeButton";
import ShareMenu from "@/components/blog/ShareMenu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/utils/useAuth";

type Props = {
  slug: string;
  likeIds: string[];
  shareUrl: string;
  title: string;
  authorId?: string | null;
};

export default function BlogActionsBar({ slug, likeIds, shareUrl, title, authorId }: Props) {
  const { user } = useAuth();
  const blogAuthorId = authorId ? authorId.toString() : "";
  const authUserId = user?.userId ? String(user.userId) : "";
  const isOwner = Boolean(authUserId && blogAuthorId && authUserId === blogAuthorId);
  const isAdmin = (user?.role || "").toString().toLowerCase() === "admin";
  const canEdit = Boolean(slug && (isOwner || isAdmin));

  return (
    <div className="flex items-center gap-2">
      <LikeButton slug={slug} initialLikes={likeIds} />
      <ShareMenu url={shareUrl} title={title} />
      {canEdit && (
        <Link href={`/blog/${encodeURIComponent(slug)}/edit`}>
          <Button size="sm" variant="outline">
            Edit
          </Button>
        </Link>
      )}
    </div>
  );
}
