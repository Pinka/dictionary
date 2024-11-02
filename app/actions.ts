"use server";

import { createGitHubIssue } from "@/lib/github";
import { headers } from "next/headers";
import { sanitizeInput } from "@/lib/sanitize";
import { checkRateLimit } from "@/lib/rate-limit";

export async function submitWord(formData: FormData) {
  const word = formData.get("word");
  if (!word || typeof word !== "string") {
    return { success: false, error: "Word is required" };
  }

  try {
    // Get client IP for rate limiting
    const identifier = headers().get("x-forwarded-for") || "anonymous";

    // Check rate limit
    const rateLimitResult = await checkRateLimit(identifier);
    if (!rateLimitResult.success) {
      return {
        success: false,
        error: "Too many requests. Please try again later.",
        reset: rateLimitResult.reset,
      };
    }

    // Sanitize input
    const sanitizedWord = sanitizeInput(word);

    // Validate sanitized input
    if (sanitizedWord.length < 1) {
      return { success: false, error: "Invalid word format" };
    }

    await createGitHubIssue(
      `Word Suggestion: ${sanitizedWord}`,
      `New word suggestion received:
      
Word: ${sanitizedWord}
Date: ${new Date().toISOString()}
User Agent: ${headers().get("user-agent")}
      
Please review this suggestion and add it to the dictionary if appropriate.`
    );

    return { success: true };
  } catch (error) {
    console.error("Error submitting word:", error);
    return { success: false, error: "Failed to submit word" };
  }
}
