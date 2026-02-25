export {};

// global types used across the app

declare global {
  interface Window {
    // add any custom globals here
    [key: string]: any;
  }
}
