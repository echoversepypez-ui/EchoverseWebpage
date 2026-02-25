import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Navigation } from "@/components/Navigation";
import { SupportChatbot } from "@/components/SupportChatbot";

export const metadata: Metadata = {
  title: "Echoverse - Online Tutorial Services",
  description: "Master new skills with our comprehensive online courses. Learn from industry experts anytime, anywhere.",
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <Navigation />
          {children}
          <SupportChatbot />
        </AuthProvider>
        {/* external chat embed removed; using internal support chatbot instead */}      </body>
    </html>
  );
}
