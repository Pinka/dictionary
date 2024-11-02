import DOMPurify from "isomorphic-dompurify";

export function sanitizeInput(input: string): string {
  // Remove any HTML tags and encode special characters
  const sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
  });

  // Additional custom sanitization
  return sanitized
    .trim()
    .slice(0, 1000) // Limit length
    .replace(/[<>]/g, ""); // Remove any remaining angle brackets
}

export function sanitizeSearchQuery(query: string): string {
  return query
    .trim()
    .slice(0, 100) // Reasonable length for search
    .replace(/[^\w\s-]/g, "") // Only allow word characters, spaces, and hyphens
    .replace(/\s+/g, " "); // Normalize whitespace
}
