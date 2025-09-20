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

const slugOptions = { lower: true, strict: true, trim: true } as const;

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
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
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ slug: string }> }
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
    } = await req.json();

    if (!title || !content || !image || !author || !category) {
      return NextResponse.json(
        {
          error: "Please provide all the required fields",
        },
        { status: 400 }
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

    const updatedBlog = await blog.findOneAndUpdate(
      { slug },
      {
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
      },
      { new: true }
    );

    if (!updatedBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ blog: updatedBlog }, { status: 200 });
  } catch (error) {
    console.error("Error updating the blog", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const foundBlog = await blog.findOneAndDelete({ slug });

    if (!foundBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Blog deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting the blog", error);
    return NextResponse.json(
      { error: "Error deleting the blog" },
      { status: 500 }
    );
  }
}
