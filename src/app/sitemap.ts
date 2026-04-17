import type { MetadataRoute } from "next";
import { getAllShowcases } from "@/lib/showcases";
import { getAllProducts } from "@/lib/products";

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
      url: `${SITE_URL}/shop`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/manhua`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/showcases`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/#services`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/#generator`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/#contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // 商品详情页（电商SEO核心）
  const productPages: MetadataRoute.Sitemap = getAllProducts().map((p) => ({
    url: `${SITE_URL}/shop/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: p.highlight ? 0.9 : 0.8,
  }));

  // 案例SEO页
  const showcasePages: MetadataRoute.Sitemap = getAllShowcases().map((s) => ({
    url: `${SITE_URL}/showcase/${s.slug}`,
    lastModified: new Date(s.publishedAt),
    changeFrequency: "monthly",
    priority: s.featured ? 0.85 : 0.75,
  }));

  return [...corePages, ...productPages, ...showcasePages];
}
