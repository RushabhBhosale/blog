"use client";

import { useEffect, useState } from "react";
import axiosClient from "@/lib/axiosclient";
import { useAuth } from "@/utils/useAuth";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Pencil, Trash } from "lucide-react";

type Comment = {
  _id: string;
  comment: string;
  username?: string;
  user?: string;
  createdAt: string;
};

type Props = {
  slug: string;
};

export default function CommentsSection({ slug }: Props) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/blog/${slug}/comment`);
        setComments(res.data.comments || []);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setComments([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to comment");
      return;
    }
    if (!newComment.trim()) return;
    try {
      setPosting(true);
      const res = await axiosClient.post(`/blog/${slug}/comment`, {
        comment: newComment,
        userId: user.userId,
        username: user.name,
      });
      setComments((prev) => [res.data.comment, ...prev]);
      setNewComment("");
      toast.success("Comment posted successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Something went wrong");
    } finally {
      setPosting(false);
    }
  };

  const handleUpdate = async (commentId: string) => {
    if (!editText.trim()) return;
    try {
      const res = await axiosClient.put(`/blog/${slug}/comment/${commentId}`, {
        comment: editText,
      });
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? res.data.comment : c)),
      );
      setEditingId(null);
      setEditText("");
      toast.success("Comment updated successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Something went wrong");
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await axiosClient.delete(`/blog/${slug}/comment/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Comment deleted successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Something went wrong");
    }
  };

  const isOwner = (comment: Comment) => {
    if (!user) return false;
    if ((comment.user || "").toString() === (user.userId || "").toString())
      return true;
    if (user.role === "admin") return true;
    return false;
  };

  return (
    <section className="mt-10 border-t border-border pt-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-3">Comments</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <Textarea
          placeholder={user ? "Write a comment..." : "Sign in to comment"}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={!user || posting}
          rows={3}
        />
        <Button type="submit" disabled={!user || posting}>
          {posting ? "Posting..." : "Post Comment"}
        </Button>
      </form>

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">Be the first to comment.</p>
        ) : (
          comments.map((c) => {
            const owner = isOwner(c);
            return (
              <div key={c._id} className="rounded-md border border-border p-3">
                <div className="text-sm text-muted-foreground flex items-center justify-between">
                  <span>
                    <strong className="text-foreground">{c.username || "User"}</strong>
                    <span className="ml-2">
                      {new Date(c.createdAt).toLocaleString()}
                    </span>
                  </span>
                  {owner && (
                    <div className="flex gap-2">
                      {editingId === c._id ? (
                        <>
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => handleUpdate(c._id)}
                          >
                            Save
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingId(null);
                              setEditText("");
                            }}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingId(c._id);
                              setEditText(c.comment);
                            }}
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(c._id)}
                          >
                            <Trash size={14} />
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
                {editingId === c._id ? (
                  <Textarea
                    className="mt-2"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={3}
                  />
                ) : (
                  <p className="mt-2 text-foreground whitespace-pre-wrap">
                    {c.comment}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

