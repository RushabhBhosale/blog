import "@/lib/db"; // initialize DB once per server instance
import Blog from "@/models/blog";
import User from "@/models/user";
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
import {
  buildItemListJsonLd,
  injectListSchemaIntoHtml,
  normalizeListItems,
} from "@/lib/list-schema";
import { replaceItemListPlaceholders } from "@/lib/list-render";

const slugOptions = { lower: true, strict: true, trim: true } as const;

function stripHtmlToText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

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
      enableListSchema,
      listItems,
      hub,
    } = await req.json();

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "Title, content, and category are required" },
        { status: 400 }
      );
    }

    if (authorId && decoded.userId !== authorId) {
      return NextResponse.json({ error: "Author mismatch" }, { status: 403 });
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
    const sanitizedListItems = normalizeListItems(listItems);
    const shouldEnableFaq = Boolean(enableFaqSchema && sanitizedFaqs.length);
    const shouldEnableList = Boolean(
      enableListSchema && sanitizedListItems.length
    );

    const incomingContent = typeof content === "string" ? content : "";
    const { htmlWithoutFaqSchema } = extractFaqSchema(incomingContent);
    let finalContent = htmlWithoutFaqSchema;
    // Replace any <!--ITEMLIST[:variant]--> placeholders with visible markup
    if (shouldEnableList) {
      finalContent = replaceItemListPlaceholders(
        finalContent,
        sanitizedListItems,
        {
          title,
        }
      );
    }
    if (shouldEnableFaq) {
      finalContent = injectFaqSchemaIntoHtml(
        finalContent,
        buildFaqJsonLd(sanitizedFaqs)
      );
    }
    if (shouldEnableList) {
      finalContent = injectListSchemaIntoHtml(
        finalContent,
        buildItemListJsonLd(sanitizedListItems, { name: title })
      );
    }

    // Determine publication status based on user policy
    let status: "Draft" | "Published" | "Pending" | "Hide" = "Published";
    try {
      const dbUser: any = await User.findById(decoded.userId).lean();
      const canAuto = dbUser?.role === "admin" || dbUser?.canAutoPublish;
      status = canAuto ? "Published" : "Pending";
    } catch {}

    const plain = stripHtmlToText(finalContent || "");
    const words = plain ? plain.split(/\s+/).filter(Boolean).length : 0;
    const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

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
      status,
      enableFaqSchema: shouldEnableFaq,
      faqs: shouldEnableFaq ? sanitizedFaqs : [],
      enableListSchema: shouldEnableList,
      listItems: shouldEnableList ? sanitizedListItems : [],
      hub:
        hub && typeof hub === "object"
          ? { slug: hub.slug, title: hub.title }
          : undefined,
      wordCount: words,
      readingTimeMinutes,
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
