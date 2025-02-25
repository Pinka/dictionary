import { getRecentSearches } from "@/app/actions/recent";
import { NextResponse } from "next/server";

// Add route segment config for caching
export const runtime = "edge";
export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  const recentSearches = await getRecentSearches();

  // Add cache headers explicitly
  return NextResponse.json(recentSearches, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
    },
  });
}
