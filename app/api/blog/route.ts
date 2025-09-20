import "@/lib/db"; // initialize DB once per server instance
import Blog from "@/models/blog";
import { NextRequest, NextResponse } from "next/server";
import { notifySubscribersOfNewBlog } from "@/lib/newsletter";
import slugify from "slugify";
import jwt from "jsonwebtoken";
import {
  buildFaqJsonLd,
  extractFaqSchema,
  injectFaqSchemaIntoHtml,
  normalizeFaqItems,
} from "@/lib/faq-schema";

const slugOptions = { lower: true, strict: true, trim: true } as const;

export async function GET() {
  const blogs = await Blog.find().select("-content").sort({ createdAt: -1 });
  return NextResponse.json({ blogs }, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {

    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const {
      title,
      content,
      category,
      tags,
      image,
      imageAlt,
      authorId,
      metaTitle,
      metaDescription,
      slug: incomingSlug,
      enableFaqSchema,
      faqs,
    } = await req.json();

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "Title, content, and category are required" },
        { status: 400 }
      );
    }

    if (authorId && decoded.userId !== authorId) {
      return NextResponse.json(
        { error: "Author mismatch" },
        { status: 403 }
      );
    }

    const slugSource =
      typeof incomingSlug === "string" && incomingSlug.trim().length
        ? incomingSlug
        : title;
    const normalizedSlug = slugify(slugSource, slugOptions);

    if (!normalizedSlug) {
      return NextResponse.json(
        { error: "Unable to generate slug" },
        { status: 400 }
      );
    }

    const sanitizedFaqs = normalizeFaqItems(faqs);
    const shouldEnableFaq = Boolean(enableFaqSchema && sanitizedFaqs.length);

    const incomingContent = typeof content === "string" ? content : "";
    const { htmlWithoutFaqSchema } = extractFaqSchema(incomingContent);
    const finalContent = shouldEnableFaq
      ? injectFaqSchemaIntoHtml(
          htmlWithoutFaqSchema,
          buildFaqJsonLd(sanitizedFaqs)
        )
      : htmlWithoutFaqSchema;

    const newBlog = await Blog.create({
      title,
      slug: normalizedSlug,
      content: finalContent,
      category,
      tags,
      image,
      imageAlt,
      metaTitle,
      metaDescription,
      author: decoded.name || decoded.email,
      authorId: decoded.userId,
      enableFaqSchema: shouldEnableFaq,
      faqs: shouldEnableFaq ? sanitizedFaqs : [],
    });

    // Fire-and-forget email notifications; do not block response
    notifySubscribersOfNewBlog({
      title,
      slug: normalizedSlug,
      image,
      category,
      author: decoded.name || decoded.email,
      createdAt: newBlog.createdAt,
    }).catch((e) => console.error("Newsletter notify error", e));

    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.error("Error posting the blog", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
