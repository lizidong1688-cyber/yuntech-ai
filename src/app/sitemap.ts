import type { MetadataRoute } from "next";
import { getAllShowcases } from "@/lib/showcases";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://yunchuangweilai.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // 静态核心页
  const corePages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/showcases`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/#services`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/#generator`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/#pricing`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/#contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // 每个案例一个独立URL（SEO核心资产）
  const showcasePages: MetadataRoute.Sitemap = getAllShowcases().map((s) => ({
    url: `${SITE_URL}/showcase/${s.slug}`,
    lastModified: new Date(s.publishedAt),
    changeFrequency: "monthly",
    priority: s.featured ? 0.85 : 0.75,
  }));

  return [...corePages, ...showcasePages];
}
