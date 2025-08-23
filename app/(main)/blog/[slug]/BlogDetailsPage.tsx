"use client";
import React, { useEffect, useState } from "react";
import { BlogInterface } from "../../home/page";
import { CommentInterface } from "./page";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, PencilIcon, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import axiosClient from "@/lib/axiosclient";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useAuth } from "@/utils/useAuth";

type Props = {
  blogDetail: BlogInterface;
  relatedAllBlogs: BlogInterface[];
};

const BlogDetailsPage = ({ blogDetail, relatedAllBlogs }: Props) => {
  const { user } = useAuth();
  const [blog, setBlog] = useState<BlogInterface>(blogDetail);
  const [relatedBlogs, setRelatedBlogs] =
    useState<BlogInterface[]>(relatedAllBlogs);
  const [comments, setComments] = useState<CommentInterface[]>([]);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const params = useParams();
  const { slug } = params;

  useEffect(() => {
    fetchComments();
  }, [slug]);

  const fetchComments = async () => {
    try {
      const res = await axiosClient.get(`/blog/${slug}/comment`);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setComments([]);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
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
        userId: user?.userId,
        username: user?.name,
      });
      fetchComments();
      setComments((prev) => [res.data.comment, ...prev]);
      setNewComment("");
      toast.success("Comment posted successfully");
    } catch (err: any) {
      console.error("Error posting comment:", err);
      toast.error(err?.response?.data?.error || "Something went wrong");
    } finally {
      setPosting(false);
    }
  };

  const handleUpdate = async (commentId: string) => {
    try {
      const res = await axiosClient.put(`/blog/${slug}/comment/${commentId}`, {
        comment: editText,
      });
      setComments((prev) =>
        prev.map((c) => (c?._id === commentId ? res.data.comment : c))
      );
      setEditingId(null);
      setEditText("");
      toast.success("Comment updated successfully");
    } catch (err: any) {
      console.error("Error updating comment:", err);
      toast.error(err?.response?.data?.error || "Something went wrong");
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await axiosClient.delete(`/blog/${slug}/comment/${commentId}`);
      setComments((prev) => prev.filter((c) => c?._id !== commentId));
      toast.success("Comment deleted successfully");
    } catch (err: any) {
      console.error("Error deleting comment:", err);
      toast.error(err?.response?.data?.error || "Something went wrong");
    }
  };

  if (!blog) return <div className="text-center py-20">Blog not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-12 flex flex-col md:flex-row gap-8">
      <div className="md:w-3/4 flex flex-col gap-6">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-54 md:h-96 object-cover rounded-xl shadow-lg"
        />

        <div className="flex justify-between">
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="px-2 py-1 bg-card/50 rounded-full">
              {blog.category}
            </span>
            <span>By {blog.author}</span>
            <span>{new Date(blog.createdAt!).toLocaleDateString()}</span>
          </div>
          {user?.userId === blog.authorId && (
            <div>
              <Link href={`/blog/${blog.slug}/edit`}>
                <Button variant="secondary">
                  <PencilIcon size={16} />
                </Button>
              </Link>
            </div>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mb-6">
          {blog.title}
        </h1>

        <div
          dangerouslySetInnerHTML={{ __html: blog.content }}
          className="prose prose-slate max-w-full text-foreground novel-content"
        ></div>

        <div className="mt-8 flex flex-wrap gap-3">
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-black/50 text-white rounded-full text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4">Comments</h3>

          <form
            onSubmit={handleCommentSubmit}
            className="flex flex-col gap-2 mb-6"
          >
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-4 py-2 border border-border rounded-lg"
            />
            <Button className="w-fit" type="submit" disabled={posting}>
              {posting ? "Posting..." : "Post"}
            </Button>
          </form>

          <div className="flex flex-col gap-4">
            {comments && comments.length > 0 ? (
              comments.map((c, index) => (
                <div
                  key={index}
                  className="px-3 pt-1 pb-3 border border-border rounded-lg bg-card/50"
                >
                  <div className="flex justify-between">
                    <div className="flex items-center gap-3 mb-2 pt-1">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-foreground capitalize">
                        {c?.username?.[0]}
                      </div>

                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground capitalize">
                          {c?.username}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(c?.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div>
                      {c?.user === user?.userId && editingId !== c?._id && (
                        <div className="flex gap-2 mt-2 text-xs">
                          <Button
                            variant={"outline"}
                            className="size-6"
                            onClick={() => {
                              setEditingId(c?._id);
                              setEditText(c?.comment);
                            }}
                          >
                            <Pencil className="size-3" />
                          </Button>
                          <Button
                            variant={"destructive"}
                            className="size-6"
                            onClick={() => handleDelete(c?._id)}
                          >
                            <Trash className="size-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {editingId === c?._id ? (
                    <div className="flex flex-col gap-2">
                      <Textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="px-2 py-1 border rounded"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(c?._id)}
                          className="px-3 py-1 bg-primary text-white rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 bg-gray-500 text-white rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-foreground italic">
                      {c?.comment}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="md:w-1/4 flex flex-col gap-4 sticky top-24 self-start">
        <h3 className="font-semibold text-lg mb-2">More in {blog.category}</h3>
        {relatedBlogs.length ? (
          relatedBlogs.map((b) => (
            <Link
              key={b._id}
              href={`/blog/${b.slug}`}
              className="flex flex-col bg-card/70 border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <img
                src={b.image}
                alt={b.title}
                className="w-full h-24 object-cover"
              />
              <div className="p-2">
                <h4 className="text-sm font-medium text-foreground">
                  {b.title}
                </h4>
                <span className="text-xs text-muted-foreground">
                  By {b.author}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-xs text-muted-foreground">No related blogs.</p>
        )}
      </div>
    </div>
  );
};

export default BlogDetailsPage;
