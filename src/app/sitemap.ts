import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://enkutatashevents.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Service-specific pages for better SEO crawlability
  const servicePages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/services/wedding`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/services/corporate`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/services/concert`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/services/cultural`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/services/decoration`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/services/stage-tent-rental`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/services/sound-lighting`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/services/catering`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  return [...staticPages, ...servicePages];
}
