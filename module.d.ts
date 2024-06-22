declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string;
    JWT_REFRESH: string
    JWT_SECRET: string;
  }
}