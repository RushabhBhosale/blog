import { connectDB } from "@/lib/db";
import { BlogInterface } from "../../home/page";
import BlogDetailsPage from "./BlogDetailsPage";
import BlogM from "@/models/blog";
import { Metadata } from "next";
import Script from "next/script";
import he from "he";
export const revalidate = 60;

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

export async function generateMetadata({ params }: any): Promise<Metadata> {
  await connectDB();
  const blog = await BlogM.findOne({ slug: params.slug });

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
  await connectDB();
  const blogData: any = await BlogM.findOne({ slug }).lean();

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
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    headline: title,
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
  const titleQ = encodeURIComponent(
    `${blogData?.title || ""} ${blogData?.metaTitle || ""}`.trim()
  );
  // Build related via aggregation (same logic as API)
  function tokenize(input?: string | null) {
    if (!input) return [] as string[];
    return input
      .toLowerCase()
      .split(/[^a-z0-9]+/gi)
      .filter((t) => t && t.length >= 3);
  }
  const category = blogData?.category;
  const tokens = tokenize(
    `${blogData?.title || ""} ${blogData?.metaTitle || ""}`
  );
  const tagList = blogData?.tags || [];
  const match: any = { slug: { $ne: slug } };
  if (category) match.category = category;
  const tokenScoreConds = tokens.map((tok) => ({
    $cond: [
      {
        $or: [
          { $regexMatch: { input: "$title", regex: tok, options: "i" } },
          { $regexMatch: { input: "$metaTitle", regex: tok, options: "i" } },
          {
            $regexMatch: {
              input: "$metaDescription",
              regex: tok,
              options: "i",
            },
          },
          { $regexMatch: { input: "$content", regex: tok, options: "i" } },
        ],
      },
      1,
      0,
    ],
  }));
  const related = await BlogM.aggregate([
    { $match: match },
    {
      $addFields: {
        tagMatches: tagList.length
          ? { $size: { $setIntersection: ["$tags", tagList] } }
          : 0,
        tokenHits: tokenScoreConds.length ? { $sum: tokenScoreConds } : 0,
        catBonus: category ? 1 : 0,
      },
    },
    {
      $addFields: {
        score: {
          $add: [{ $multiply: ["$tagMatches", 3] }, "$tokenHits", "$catBonus"],
        },
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
