declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_TOKEN: string;
      GITHUB_OWNER: string;
      GITHUB_REPO: string;
      ALLOWED_ORIGIN?: string;
    }
  }
}

export {};
