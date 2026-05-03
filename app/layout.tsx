import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { ToastContainer } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "نظام الوحش — مجموعة الوحش للأغذية",
  description:
    "النظام التشغيلي المتكامل لمجموعة الوحش — الفروع، المصنع، والمكتب الرئيسي.",
  applicationName: "Wahsh ERP",
  authors: [{ name: "El Wahsh Group" }],
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#212121" },
    { media: "(prefers-color-scheme: light)", color: "#fbf8f4" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      data-theme="wahsh"
      data-mode="light"
      suppressHydrationWarning
    >
      <head>
        <link
          rel="preload"
          href="/fonts/thmanyahsans-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/thmanyahsans-Medium.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/thmanyahsans-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-bg-canvas text-text-primary antialiased">
        <AuthProvider>
          <ToastProvider>
            <ThemeProvider>{children}</ThemeProvider>
            <ToastContainer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
