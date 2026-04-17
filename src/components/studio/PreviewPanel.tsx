"use client";

import { useMemo, useState } from "react";
import type { StudioProject, AIPlatform } from "@/lib/studio";
import {
  AI_PLATFORMS,
  compilePrompt,
  NEGATIVE_PROMPT,
  PALETTE_META,
} from "@/lib/studio";

interface Props {
  project: StudioProject;
  onShareUrl: () => string;
}

export default function PreviewPanel({ project, onShareUrl }: Props) {
  const [exportPlatform, setExportPlatform] = useState<AIPlatform>(
    project.targetPlatform
  );
  const [copiedWhat, setCopiedWhat] = useState<string | null>(null);

  const compiled = useMemo(
    () => compilePrompt(project, exportPlatform),
    [project, exportPlatform]
  );

  const totalShotsDuration = useMemo(
    () => project.shots.reduce((sum, s) => sum + s.duration, 0),
    [project.shots]
  );

  const paletteSwatch = PALETTE_META[project.palette].swatch;

  function copy(content: string, key: string) {
    navigator.clipboard.writeText(content);
    setCopiedWhat(key);
    setTimeout(() => setCopiedWhat(null), 2000);
  }

  function handleShare() {
    const url = onShareUrl();
    navigator.clipboard.writeText(url);
    setCopiedWhat("share");
    setTimeout(() => setCopiedWhat(null), 2500);
  }

  const aspectRatioW =
    project.aspectRatio === "16:9"
      ? 16
      : project.aspectRatio === "9:16"
        ? 9
        : project.aspectRatio === "1:1"
          ? 1
          : project.aspectRatio === "4:5"
            ? 4
            : 2.35;
  const aspectRatioH =
    project.aspectRatio === "16:9"
      ? 9
      : project.aspectRatio === "9:16"
        ? 16
        : project.aspectRatio === "1:1"
          ? 1
          : project.aspectRatio === "4:5"
            ? 5
            : 1;

  return (
    <div className="space-y-4">
      {/* 画面预览框 */}
      <div>
        <div className="text-xs text-gray-400 mb-2">画面比例预览</div>
        <div className="p-4 rounded-xl bg-surface-light/40 border border-border/30">
          <div
            className="mx-auto rounded-lg overflow-hidden relative"
            style={{
              background: `linear-gradient(135deg, ${paletteSwatch.join(", ")})`,
              aspectRatio: `${aspectRatioW} / ${aspectRatioH}`,
              maxWidth:
                project.aspectRatio === "9:16" || project.aspectRatio === "4:5"
                  ? "180px"
                  : "100%",
            }}
          >
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="text-white/70 text-xs font-mono">
                {project.aspectRatio}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 时长检查 */}
      <div
        className={`p-3 rounded-lg text-xs ${
          Math.abs(totalShotsDuration - project.totalDuration) < 0.5
            ? "bg-green-500/10 border border-green-500/30 text-green-300"
            : "bg-amber-500/10 border border-amber-500/30 text-amber-300"
        }`}
      >
        镜头总时长 <strong>{totalShotsDuration.toFixed(1)}s</strong> · 目标{" "}
        <strong>{project.totalDuration}s</strong>
        {Math.abs(totalShotsDuration - project.totalDuration) >= 0.5 && (
          <span className="block mt-1 text-[10px] opacity-80">
            💡 调整各镜头时长让两者接近
          </span>
        )}
      </div>

      {/* 导出平台切换 */}
      <div>
        <div className="text-xs text-gray-400 mb-2">导出格式</div>
        <div className="grid grid-cols-2 gap-1.5">
          {AI_PLATFORMS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setExportPlatform(p.value)}
              className={`px-2 py-1.5 rounded-md text-xs transition-all ${
                exportPlatform === p.value
                  ? "bg-accent/30 text-white border border-accent/60"
                  : "bg-surface-light text-gray-400 border border-transparent hover:text-white"
              }`}
            >
              {p.flag} {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* 编译后的Prompt */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-gray-400">生成的Prompt</div>
          <button
            type="button"
            onClick={() => copy(compiled, "prompt")}
            className="px-3 py-1 text-xs rounded-md bg-accent/20 text-accent-light hover:bg-accent/30 transition-colors"
          >
            {copiedWhat === "prompt" ? "✓ 已复制" : "📋 复制"}
          </button>
        </div>
        <div className="relative">
          <pre className="p-3 rounded-xl bg-background/60 border border-border/30 text-xs text-gray-200 font-mono leading-relaxed max-h-96 overflow-auto whitespace-pre-wrap">
            {compiled || "开始填写镜头内容，Prompt会实时生成..."}
          </pre>
        </div>
      </div>

      {/* 负向Prompt */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-gray-400">负向Prompt (通用)</div>
          <button
            type="button"
            onClick={() => copy(NEGATIVE_PROMPT, "neg")}
            className="px-3 py-1 text-xs rounded-md bg-surface-light text-gray-400 hover:text-white transition-colors"
          >
            {copiedWhat === "neg" ? "✓" : "复制"}
          </button>
        </div>
        <div className="p-2 rounded-lg bg-background/40 border border-border/20 text-[10px] text-gray-500 font-mono leading-relaxed">
          {NEGATIVE_PROMPT}
        </div>
      </div>

      {/* 分享 */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-purple-500/10 border border-accent/30">
        <div className="text-xs font-medium text-white mb-2">🔗 分享这个项目</div>
        <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
          生成唯一URL，别人打开即可看到你的完整项目设置
        </p>
        <button
          type="button"
          onClick={handleShare}
          className="w-full py-2.5 rounded-lg bg-white text-background text-sm font-medium hover:bg-gray-100 transition-colors"
        >
          {copiedWhat === "share" ? "✓ 链接已复制到剪贴板" : "生成分享链接"}
        </button>
      </div>
    </div>
  );
}
