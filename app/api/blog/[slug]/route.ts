import "@/lib/db"; // initialize DB once per server instance
import blog from "@/models/blog";
import { NextResponse } from "next/server";
import slugify from "slugify";
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

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;

    const foundBlog = await blog.findOne({ slug });

    if (!foundBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    console.log("Blog", foundBlog);

    return NextResponse.json({ blog: foundBlog }, { status: 200 });
  } catch (error) {
    console.error("Error finding the blog", error);
    return NextResponse.json(
      { error: "Error finding the blog" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;
    const {
      title,
      content,
      tags,
      image,
      imageAlt,
      author,
      category,
      metaTitle,
      metaDescription,
      slug: incomingSlug,
      enableFaqSchema,
      faqs,
      enableListSchema,
      listItems,
      hub,
      format,
      language,
    } = await req.json();

    if (!title || !content || !image || !author || !category) {
      return NextResponse.json(
        {
          error: "Please provide all the required fields",
        },
        { status: 400 },
      );
    }

    const slugSource =
      typeof incomingSlug === "string" && incomingSlug.trim().length
        ? incomingSlug
        : title;
    const slug2 = slugify(slugSource, slugOptions);

    if (!slug2) {
      return NextResponse.json(
        { error: "Unable to generate slug" },
        { status: 400 },
      );
    }

    const sanitizedFaqs = normalizeFaqItems(faqs);
    const sanitizedListItems = normalizeListItems(listItems);
    const shouldEnableFaq = Boolean(enableFaqSchema && sanitizedFaqs.length);
    const shouldEnableList = Boolean(
      enableListSchema && sanitizedListItems.length,
    );

    const incomingContent = typeof content === "string" ? content : "";
    const { htmlWithoutFaqSchema } = extractFaqSchema(incomingContent);
    let finalContent = htmlWithoutFaqSchema;
    // Replace <!--ITEMLIST[:variant]--> placeholders with visible markup at author-chosen position
    if (shouldEnableList) {
      finalContent = replaceItemListPlaceholders(
        finalContent,
        sanitizedListItems,
        {
          title,
        },
      );
    }
    if (shouldEnableFaq) {
      finalContent = injectFaqSchemaIntoHtml(
        finalContent,
        buildFaqJsonLd(sanitizedFaqs),
      );
    }
    if (shouldEnableList) {
      finalContent = injectListSchemaIntoHtml(
        finalContent,
        buildItemListJsonLd(sanitizedListItems, { name: title }),
      );
    }

    const set: any = {
      title,
      slug: slug2,
      content: finalContent,
      tags,
      image,
      imageAlt,
      author,
      category,
      metaTitle,
      metaDescription,
      enableFaqSchema: shouldEnableFaq,
      faqs: shouldEnableFaq ? sanitizedFaqs : [],
      enableListSchema: shouldEnableList,
      listItems: shouldEnableList ? sanitizedListItems : [],
    };
    if (hub && typeof hub === "object") {
      set.hub = { slug: hub.slug, title: hub.title };
    }
    const update: any = { $set: set };
    if (hub === null) {
      update.$unset = { hub: "" };
    }

    const plain = stripHtmlToText(finalContent || "");
    const words = plain ? plain.split(/\s+/).filter(Boolean).length : 0;
    const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

    const updatedBlog = await blog.findOneAndUpdate(
      { slug },
      {
        ...update,
        $set: {
          ...(update.$set || {}),
          wordCount: words,
          readingTimeMinutes,
          ...(typeof format === "string" && ["movie", "tvseries"].includes(format)
            ? { format }
            : {}),
          ...(typeof language === "string" ? { language } : {}),
        },
      },
      { new: true },
    );

    if (!updatedBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ blog: updatedBlog }, { status: 200 });
  } catch (error) {
    console.error("Error updating the blog", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;
    const foundBlog = await blog.findOneAndDelete({ slug });

    if (!foundBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Blog deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error deleting the blog", error);
    return NextResponse.json(
      { error: "Error deleting the blog" },
      { status: 500 },
    );
  }
}
