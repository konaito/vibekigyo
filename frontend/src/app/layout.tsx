import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://vibekigyomd.vercel.app'),
  title: "vibe起業.md - AIと壁打ちで企画書作成",
  description: "起業家がAIとの壁打ちを通じて、企画書をMarkdown形式で生成・発展させるチャットアプリケーション",
  openGraph: {
    title: "vibe起業.md - AIと壁打ちで企画書作成",
    description: "起業家がAIとの壁打ちを通じて、企画書をMarkdown形式で生成・発展させるチャットアプリケーション",
    url: "https://vibekigyomd.vercel.app",
    siteName: "vibe起業.md",
    images: [
      {
        url: "/image.png",
        width: 1200,
        height: 630,
        alt: "vibe起業.md - AIと壁打ちで企画書作成",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "vibe起業.md - AIと壁打ちで企画書作成",
    description: "起業家がAIとの壁打ちを通じて、企画書をMarkdown形式で生成・発展させるチャットアプリケーション",
    images: ["/image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
