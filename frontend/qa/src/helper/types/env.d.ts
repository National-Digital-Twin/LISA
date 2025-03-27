export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BROWSER: 'chrome' | 'firefox' | 'webkit';
      ENV: 'staging' | 'prod' | 'demo' | 'dev';
      BASEURL: string;
      LISAURL: string;
      HEAD: 'true' | 'false';
      USERNAME: string;
    }
  }
}
