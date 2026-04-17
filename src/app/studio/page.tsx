import type { Metadata } from "next";
import StudioApp from "./StudioApp";

export const metadata: Metadata = {
  title: "AI视频提示词工作室 · 免费专业工具 | 云创未来",
  description:
    "可视化构建AI视频提示词：镜头语言编辑、色彩与光线选择、节奏控制。一键导出为Wan 2.2、Sora、Runway、Pika等6+主流平台格式。项目自动保存，支持URL分享。永久免费。",
  keywords: [
    "AI视频提示词工具",
    "AI镜头语言编辑器",
    "Wan 2.2提示词",
    "Sora提示词构建",
    "Runway Prompt",
    "Pika提示词",
    "AI视频生成工具",
    "prompt engineering",
  ],
  openGraph: {
    title: "AI视频提示词工作室 · 免费专业工具",
    description:
      "可视化构建专业AI视频提示词，16行业×12风格×多平台导出，零门槛零成本",
    type: "website",
    locale: "zh_CN",
  },
};

export default function StudioPage() {
  return <StudioApp />;
}
