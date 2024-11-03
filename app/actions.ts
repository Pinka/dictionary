"use server";

import { createGitHubIssue } from "@/lib/github";
import { headers } from "next/headers";
import { sanitizeInput } from "@/lib/sanitize";
import { checkRateLimit } from "@/lib/rate-limit";

interface WordSubmission {
  mauritian: string;
  english: string;
}

export async function submitWord({ mauritian, english }: WordSubmission) {
  if (!mauritian || !english) {
    return {
      success: false,
      error: "Both Mauritian and English words are required",
    };
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

    // Sanitize inputs
    const sanitizedMauritian = sanitizeInput(mauritian);
    const sanitizedEnglish = sanitizeInput(english);

    // Validate sanitized inputs
    if (sanitizedMauritian.length < 1 || sanitizedEnglish.length < 1) {
      return { success: false, error: "Invalid word format" };
    }

    await createGitHubIssue(
      `Word Suggestion: ${sanitizedMauritian}`,
      `New word suggestion received:
      
Mauritian Creole: ${sanitizedMauritian}
English: ${sanitizedEnglish}
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
