declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REDIS_URL: string;
      REDIS_TOKEN: string;
      GITHUB_TOKEN: string;
      GITHUB_OWNER: string;
      GITHUB_REPO: string;
      ALLOWED_ORIGIN?: string;
    }
  }
}

export {};
