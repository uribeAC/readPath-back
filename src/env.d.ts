declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    DATABASE_CONNECTION_STRING: string;
  }
}
