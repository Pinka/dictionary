"use server";

import { createGitHubIssue } from "@/lib/github";
import { headers } from "next/headers";

export async function submitWord(formData: FormData) {
  const word = formData.get("word");
  if (!word || typeof word !== "string") {
    return { success: false, error: "Word is required" };
  }

  try {
    await createGitHubIssue(
      `Word Suggestion: ${word}`,
      `New word suggestion received:
      
Word: ${word}
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
