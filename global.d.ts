export {};

declare global {
  interface Window {
    hsConversationsOnReady?: Array<() => void>;
    HubSpotConversations?: any;
  }
}
