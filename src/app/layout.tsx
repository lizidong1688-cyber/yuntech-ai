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

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://yunchuangweilai.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "云创未来 | AI视频与图像智能生成服务",
  description:
    "海口云创未来科技有限公司 — 专业AI视频生成、AI图像创作、电商产品视频、品牌宣传片制作。基于最前沿AI技术，为企业提供高效、低成本的智能内容生产解决方案。",
  keywords: [
    "AI视频生成",
    "AI图像生成",
    "AI商业视频",
    "电商视频制作",
    "海南AI公司",
    "智能内容创作",
    "Wan视频生成",
    "品牌宣传片AI",
  ],
  openGraph: {
    title: "云创未来 | AI视频与图像智能生成服务",
    description:
      "基于最前沿AI技术，为企业提供高效、低成本的智能内容生产解决方案",
    locale: "zh_CN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
