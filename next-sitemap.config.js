/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://yourdomain.com",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "daily",
  priority: 0.7,
  additionalSitemaps: ["https://dailysparks.rushabh.in/server-sitemap.xml"],
};
