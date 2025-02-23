import { getRecentSearches } from "@/app/actions/recent";
import { NextResponse } from "next/server";

export async function GET() {
  const recentSearches = await getRecentSearches();
  return NextResponse.json(recentSearches);
}
