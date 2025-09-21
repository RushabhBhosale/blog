"use client";
import React, { useEffect, useState } from "react";
import { BlogInterface } from "../../home/page";
import { CommentInterface } from "./page";
import Link from "next/link";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart,
  Pencil,
  PencilIcon,
  Trash,
  Share2,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axiosClient from "@/lib/axiosclient";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useAuth } from "@/utils/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(
    blogDetail?.likes?.length || 0
  );
  const [liking, setLiking] = useState(false);

  const params = useParams();
  const { slug } = params;

  useEffect(() => {
    fetchComments();
  }, [slug]);

  useEffect(() => {
    if (user && blog?.likes) {
      const u = user?.userId;
      const likedByUser = (blog.likes as any[])?.some(
        (id: any) => id?.toString() === u?.toString()
      );
      setLiked(!!likedByUser);
    } else {
      setLiked(false);
    }
    setLikeCount(blog?.likes?.length || 0);
  }, [user, blog]);

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

  const toggleLike = async () => {
    if (!user) {
      toast.error("You must be logged in to like");
      return;
    }
    try {
      if (liking) return;
      setLiking(true);
      const nextLiked = !liked;
      setLiked(nextLiked);
      setLikeCount((c) => (nextLiked ? c + 1 : Math.max(0, c - 1)));
      const res = await axiosClient.patch(`/blog/${slug}/likes`, {
        userId: user.userId,
      });
      setLiked(res.data.liked);
      setLikeCount(res.data.totalLikes);
      setBlog(
        (prev) =>
          ({
            ...prev,
            likes: res.data.blog?.likes || prev.likes,
          } as any)
      );
    } catch (err: any) {
      const reverted = liked;
      setLiked(reverted);
      setLikeCount((c) => (reverted ? c + 1 : Math.max(0, c - 1)));
      console.error("Error toggling like:", err);
      toast.error(err?.response?.data?.error || "Something went wrong");
    } finally {
      setLiking(false);
    }
  };

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Check out this post: ${blog.title}`;

  if (!blog) return <div className="text-center py-20">Blog not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-12 flex flex-col md:flex-row gap-8">
      <div className="md:w-3/4 flex flex-col gap-6 md:gap-6">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="text-sm text-muted-foreground -mb-2"
        >
          <ol className="flex items-center gap-1 flex-wrap">
            <li className="flex items-center">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <span className="mx-2">›</span>
            </li>
            {blog.category && (
              <li className="flex items-center">
                <Link
                  href={`/blogs/${encodeURIComponent(blog.category)}`}
                  className="hover:underline"
                >
                  {blog.category}
                </Link>
                <span className="mx-2">›</span>
              </li>
            )}
            {blog.hub?.slug && (
              <li className="flex items-center">
                <Link
                  href={`/blogs/${encodeURIComponent(blog.category)}/${encodeURIComponent(blog.hub.slug)}`}
                  className="hover:underline"
                >
                  {blog.hub?.title || blog.hub.slug}
                </Link>
                <span className="mx-2">›</span>
              </li>
            )}
            <li className="text-foreground truncate max-w-full">
              {blog.title}
            </li>
          </ol>
        </nav>

        <div className="relative w-full h-56 sm:h-64 md:h-96 rounded-xl shadow-lg overflow-hidden">
          <Image
            src={blog.image}
            alt={blog.imageAlt || blog.title}
            fill
            sizes="(max-width: 768px) 100vw, 75vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="md:mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="px-2 py-1 bg-card/50 rounded-full">
              {blog.category}
            </span>
            <Link
              href={`/author/${encodeURIComponent(
                (blog.author || "")
                  .trim()
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/gi, "-")
                  .replace(/^-+|-+$/g, "")
              )}`}
              className="hover:underline"
            >
              By {blog.author}
            </Link>
            <span>{new Date(blog.createdAt!).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={toggleLike}
              disabled={liking}
              className="flex items-center gap-2"
            >
              <Heart
                size={16}
                className={
                  liked ? "fill-red-500 text-red-500" : "text-foreground"
                }
              />
              <span className="text-sm">{likeCount}</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Share2 size={16} />
                  <span className="text-sm">Share</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={async () => {
                    await navigator.clipboard.writeText(currentUrl);
                    toast.success("Link copied to clipboard");
                  }}
                >
                  <LinkIcon size={14} className="mr-2" /> Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                      currentUrl
                    )}&text=${encodeURIComponent(shareText)}`}
                    target="_blank"
                  >
                    X (Twitter)
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      currentUrl
                    )}`}
                    target="_blank"
                  >
                    Facebook
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      currentUrl
                    )}`}
                    target="_blank"
                  >
                    LinkedIn
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {user?.userId === blog.authorId && (
              <Link href={`/blog/${blog.slug}/edit`}>
                <Button variant="secondary">
                  <PencilIcon size={16} />
                </Button>
              </Link>
            )}
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground md:mb-6">
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

        {blog?.enableFaqSchema && (blog?.faqs?.length || 0) > 0 && (
          <section className="mt-10 border-t border-border pt-6">
            <h2 className="text-xl sm:text-2xl font-semibold md:mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {blog.faqs!.map((faq, idx) => (
                <details
                  key={idx}
                  className="group rounded-md border border-border bg-card/60 p-4"
                >
                  <summary className="cursor-pointer list-none font-medium text-foreground flex items-center justify-between">
                    <span>{faq.question}</span>
                    <span className="ml-3 text-muted-foreground transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="mt-3 text-sm text-muted-foreground whitespace-pre-line">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="md:w-1/4 w-full flex flex-col gap-3 sticky top-24 self-start">
        <h3 className="font-semibold text-lg mb-2">Related Blogs</h3>
        {relatedBlogs.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3">
            {relatedBlogs.map((b) => (
              <Link
                key={b._id}
                href={
                  (b as any)?.hub?.slug
                    ? `/blogs/${encodeURIComponent(b.category)}/${encodeURIComponent((b as any).hub.slug)}/${encodeURIComponent(b.slug)}`
                    : `/blog/${b.slug}`
                }
                className="flex bg-card/70 border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <div className="relative w-24 h-full overflow-hidden shrink-0">
                  <Image
                    src={b.image}
                    alt={b.imageAlt || b.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-2">
                  <h4 className="text-sm font-medium text-foreground line-clamp-2">
                    {b.title}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    By {b.author}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No related blogs.</p>
        )}
      </div>
    </div>
  );
};

export default BlogDetailsPage;
