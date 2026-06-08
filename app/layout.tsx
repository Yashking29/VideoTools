import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: {
    default: "Free Online Video Tools — No Upload Required",
    template: "%s | VideoTools.app",
  },
  description:
    "Free online video tools that run entirely in your browser. Compress, trim, convert, and edit videos without uploading to any server. 100% private.",
  keywords: [
    "free video tools",
    "online video compressor",
    "video trimmer online",
    "video to gif converter",
    "no upload video editor",
  ],
  metadataBase: new URL("https://zipvid.online"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "VideoTools.app",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "VideoTools — Free Online Video Tools" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "android-chrome-192x192", url: "/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/android-chrome-512x512.png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
      <GoogleAnalytics gaId="G-1W90F38J9L" />
    </html>
  );
}
