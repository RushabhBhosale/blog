import { connectDB } from "@/lib/db";
import { BlogInterface } from "../../home/page";
import BlogDetailsPage from "./BlogDetailsPage";
import BlogM from "@/models/blog";
import { Metadata } from "next";
import Script from "next/script";
import he from "he";
export const revalidate = 60;
import { cache } from "react";

export interface CommentInterface {
  _id: string;
  comment: string;
  user: {
    name: string;
    email: string;
    imageUrl?: string;
    _id?: string;
  };
  username: string;
  createdAt: string;
}

const SITE = "https://dailysparks.in";

const canonicalFor = (slug: string) =>
  new URL(`/blog/${encodeURIComponent(slug)}`, SITE).toString();

// Deduped, cached per-request DB fetch for the blog by slug
const getBlogBySlug = cache(async (slug: string) => {
  await connectDB();
  return await BlogM.findOne({ slug })
    .select(
      "title metaTitle metaDescription image content createdAt updatedAt author category tags slug imageAlt likes"
    )
    .lean();
});

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const blog = (await getBlogBySlug(params.slug)) as any;

  if (!blog) {
    const notFoundUrl = canonicalFor(params.slug);
    return {
      title: "Blog Not Found",
      description: "This blog could not be found.",
      alternates: { canonical: notFoundUrl },
      metadataBase: new URL(SITE),
      robots: { index: false, follow: false },
    };
  }

  const title = he.decode(blog.metaTitle || blog.title);
  const description =
    blog.metaDescription || blog.content.replace(/<[^>]+>/g, "").slice(0, 160);

  const canonical = canonicalFor(params.slug);
  const imageAbs = blog.image?.startsWith("http")
    ? blog.image
    : new URL(blog.image || "/og-default.jpg", SITE).toString();

  return {
    title,
    description,
    alternates: { canonical },
    metadataBase: new URL(SITE),
    openGraph: {
      title,
      description,
      url: canonical,
      images: [{ url: imageAbs }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageAbs],
    },
  };
}

export default async function Blog({ params }: any) {
  const { slug } = params;
  const blogData: any = await getBlogBySlug(slug);

  if (!blogData) {
    return <div>Blog not found</div>;
  }

  const canonical = canonicalFor(slug);
  const title = he.decode(blogData.metaTitle || blogData.title);
  const description =
    blogData.metaDescription || blogData.content.replace(/<[^>]+>/g, "").slice(0, 160);
  const imageAbs = blogData.image?.startsWith("http")
    ? blogData.image
    : new URL(blogData.image || "/og-cover.png", SITE).toString();
  const published = blogData.createdAt
    ? new Date(blogData.createdAt).toISOString()
    : undefined;
  const modified = blogData.updatedAt
    ? new Date(blogData.updatedAt).toISOString()
    : published;
  const categoryName = blogData?.category || "";
  const tagsArr: string[] = Array.isArray(blogData?.tags) ? blogData.tags : [];

  const publisherLogo = new URL("/og-cover.png", SITE).toString();

  const authorSlug = (blogData.author || "").trim().toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "");
  const authorUrl = authorSlug
    ? new URL(`/author/${encodeURIComponent(authorSlug)}`, SITE).toString()
    : SITE;
  const authorLd = authorSlug
    ? { "@type": "Person", name: blogData.author, url: authorUrl }
    : { "@type": "Organization", name: "DailySparks Team", url: SITE };

  const blogPosting = {
    "@type": "BlogPosting",
    "@id": `${canonical}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    headline: title,
    name: title,
    description,
    image: [imageAbs],
    author: authorLd,
    publisher: {
      "@type": "Organization",
      name: "DailySparks",
      logo: { "@type": "ImageObject", url: publisherLogo },
    },
    datePublished: published,
    dateModified: modified,
    url: canonical,
    articleSection: categoryName,
    keywords: tagsArr.join(", "),
  } as const;

  const breadcrumbList = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE,
      },
      ...(categoryName
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: categoryName,
              item: new URL(`/blog/category/${encodeURIComponent(categoryName)}`, SITE).toString(),
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: categoryName ? 3 : 2,
        name: title,
        item: canonical,
      },
    ],
  } as const;

  const tags = (blogData?.tags || []).join(",");
  // Simpler and much faster related-posts query using category/tags only
  const category = blogData?.category || "";
  const tagList: string[] = Array.isArray(blogData?.tags) ? blogData.tags : [];

  const related = await BlogM.aggregate([
    {
      $match: {
        slug: { $ne: slug },
        $or: [
          ...(category ? [{ category }] as any[] : []),
          ...(tagList.length ? [{ tags: { $in: tagList } }] : []),
        ],
      },
    },
    {
      $addFields: {
        tagMatches: tagList.length
          ? { $size: { $setIntersection: ["$tags", tagList] } }
          : 0,
        catBonus: category ? { $cond: [{ $eq: ["$category", category] }, 1, 0] } : 0,
      },
    },
    {
      $addFields: {
        score: { $add: [{ $multiply: ["$tagMatches", 3] }, "$catBonus"] },
      },
    },
    { $sort: { score: -1, createdAt: -1 } },
    { $limit: 6 },
    { $project: { content: 0 } },
  ]);

  return (
    <>
      <Script
        id="jsonld-blog"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [blogPosting, breadcrumbList],
          }),
        }}
      />
      <BlogDetailsPage
        blogDetail={JSON.parse(JSON.stringify(blogData))}
        relatedAllBlogs={JSON.parse(JSON.stringify(related))}
      />
    </>
  );
}
