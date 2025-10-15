import "@/lib/db"; // initialize DB once per server instance
import { dbReady } from "@/lib/db";
import { extractFaqSchema } from "@/lib/faq-schema";
import Blog from "@/models/blog";
import type { Metadata } from "next";
import Script from "next/script";
import he from "he";
import { notFound } from "next/navigation";
import BlogDetailsPage from "@/app/(main)/blog/[slug]/BlogDetailsPage";

const SITE = "https://dailysparks.in";

const canonicalFor = (category: string, hub: string, slug: string) =>
  new URL(
    `/blogs/${encodeURIComponent(category)}/${encodeURIComponent(hub)}/${encodeURIComponent(slug)}`,
    SITE,
  ).toString();

async function fetchBlog(slug: string) {
  await dbReady;
  return await Blog.findOne({ slug })
    .select(
      "title metaTitle metaDescription image content createdAt updatedAt author authorId category tags slug imageAlt likes hub status viewCount readingTimeMinutes wordCount enableFaqSchema faqs",
    )
    .lean();
}

export async function generateMetadata(context: {
  params: Promise<{ category: string; hub: string; slug: string }>;
}): Promise<Metadata> {
  const { category, hub, slug } = await context.params;
  const blog: any = await fetchBlog(slug);
  if (!blog) return { robots: { index: false, follow: false } };
  // Guard that route matches
  const catOk = new RegExp(`^${category.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i").test(
    blog.category || "",
  );
  if (!catOk || blog?.hub?.slug !== hub) return { robots: { index: false, follow: false } };

  const title = he.decode(blog.metaTitle || blog.title);
  const description =
    blog.metaDescription || String(blog.content || "").replace(/<[^>]+>/g, "").slice(0, 160);
  const canonical = canonicalFor(category, hub, slug);
  const imageAbs = blog.image?.startsWith("http")
    ? blog.image
    : new URL(blog.image || "/og-default.jpg", SITE).toString();

  return {
    title,
    description,
    alternates: { canonical },
    metadataBase: new URL(SITE),
    openGraph: { title, description, url: canonical, images: [{ url: imageAbs }], type: "article" },
    twitter: { card: "summary_large_image", title, description, images: [imageAbs] },
  };
}

export default async function Page(context: {
  params: Promise<{ category: string; hub: string; slug: string }>;
}) {
  const { category, hub, slug } = await context.params;
  const blogData: any = await fetchBlog(slug);
  const canView = !blogData?.status || blogData?.status === "Published";
  if (!blogData || !canView) notFound();
  const catOk = new RegExp(`^${category.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i").test(
    blogData.category || "",
  );
  if (!catOk || blogData?.hub?.slug !== hub) notFound();

  const { htmlWithoutFaqSchema } = extractFaqSchema(blogData?.content || "");
  blogData.content = htmlWithoutFaqSchema;

  const canonical = canonicalFor(category, hub, slug);
  const title = he.decode(blogData.metaTitle || blogData.title);
  const description =
    blogData.metaDescription ||
    String(blogData.content || "").replace(/<[^>]+>/g, "").slice(0, 160);
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
  const hubName = blogData?.hub?.title || hub;
  const tagsArr: string[] = Array.isArray(blogData?.tags) ? blogData.tags : [];

  const publisherLogo = new URL("/og-cover.png", SITE).toString();

  const authorSlug = (blogData.author || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "");
  const authorUrl = authorSlug
    ? new URL(`/author/${encodeURIComponent(authorSlug)}`, SITE).toString()
    : SITE;
  const authorLd = authorSlug
    ? { "@type": "Person", name: blogData.author, url: authorUrl }
    : { "@type": "Organization", name: "DailySparks Team", url: SITE };

  const hubUrl = new URL(
    `/blogs/${encodeURIComponent(categoryName)}/${encodeURIComponent(hub)}`,
    SITE,
  ).toString();

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
    isPartOf: { "@type": "Collection", url: hubUrl, name: hubName },
  } as const;

  const breadcrumbList = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryName,
        item: new URL(`/blogs/${encodeURIComponent(categoryName)}`, SITE).toString(),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: hubName,
        item: hubUrl,
      },
      { "@type": "ListItem", position: 4, name: title, item: canonical },
    ],
  } as const;

  const faqSchema =
    blogData?.enableFaqSchema && Array.isArray(blogData?.faqs) && blogData.faqs.length
      ? {
          "@type": "FAQPage",
          "@id": `${canonical}#faq`,
          inLanguage: "en",
          url: canonical,
          mainEntity: blogData.faqs.map((faq: any) => ({
            "@type": "Question",
            name: (faq.question || "").trim(),
            acceptedAnswer: {
              "@type": "Answer",
              text: (faq.answer || "").trim(),
            },
          })),
        }
      : null;

  const graphItems = faqSchema
    ? [blogPosting, breadcrumbList, faqSchema]
    : [blogPosting, breadcrumbList];

  // related posts (same as /blog/[slug])
  await dbReady;
  const tagList: string[] = Array.isArray(blogData?.tags) ? blogData.tags : [];
  const related = await Blog.aggregate([
    {
      $match: {
        slug: { $ne: slug },
        $or: [
          ...(categoryName ? ([{ category: categoryName }] as any[]) : []),
          ...(tagList.length ? [{ tags: { $in: tagList } }] : []),
        ],
      },
    },
    {
      $addFields: {
        tagMatches: tagList.length
          ? { $size: { $setIntersection: ["$tags", tagList] } }
          : 0,
        catBonus: categoryName
          ? { $cond: [{ $eq: ["$category", categoryName] }, 1, 0] }
          : 0,
      },
    },
    { $addFields: { score: { $add: [{ $multiply: ["$tagMatches", 3] }, "$catBonus"] } } },
    { $sort: { score: -1, createdAt: -1 } },
    { $limit: 6 },
    { $project: { content: 0 } },
  ]);

  return (
    <>
      <Script
        id="jsonld-blog-hub"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": graphItems,
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
