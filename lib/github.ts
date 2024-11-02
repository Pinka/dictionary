const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.GITHUB_OWNER || "your-username";
const REPO_NAME = process.env.GITHUB_REPO || "your-repo";

export async function createGitHubIssue(title: string, body: string) {
  const response = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
    {
      method: "POST",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent": "Dictionary-App",
      },
      body: JSON.stringify({
        title,
        body,
        labels: ["word-suggestion"],
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create GitHub issue");
  }

  return response.json();
}
