import type { MetadataRoute } from "next";
import { getDirectory } from "@/lib/data/places";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const directory = await getDirectory();
  const listings = directory.ok ? directory.listings : [];

  return [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/report`, changeFrequency: "monthly", priority: 0.6 },
    ...listings.map((listing) => ({
      url: `${BASE_URL}/places/${listing.id}`,
      lastModified: listing.last_checked ? new Date(listing.last_checked) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
