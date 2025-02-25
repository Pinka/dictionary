import { searchDictionary } from "@/lib/search";
import { NextResponse } from "next/server";
import { searchRateLimiter } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "anonymous";

  const rateLimitResult = await searchRateLimiter.check(ip);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: "Too many requests. Please try again later.",
        reset: rateLimitResult.reset,
        remaining: rateLimitResult.remaining,
      },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  const suggestions = await searchDictionary(query);
  return NextResponse.json(suggestions, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
    },
  });
}
