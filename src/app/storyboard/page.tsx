import type { Metadata } from "next";
import StoryboardApp from "./StoryboardApp";

export const metadata: Metadata = {
  title: "分镜板 · AI一键出完整视觉分镜 | 云创未来",
  description:
    "基于您在Studio编辑的镜头序列，一键生成完整的AI视觉分镜板。传统分镜师3天的工作，AI 30秒完成。",
  keywords: [
    "AI分镜板",
    "AI storyboard",
    "AI分镜生成",
    "AI视频分镜设计",
    "免费分镜板工具",
  ],
  openGraph: {
    title: "AI分镜板 · 30秒看到完整视觉",
    description: "传统分镜师要3天，我们AI 30秒就能给您全套分镜",
    type: "website",
    locale: "zh_CN",
  },
};

export default function StoryboardPage() {
  return <StoryboardApp />;
}
