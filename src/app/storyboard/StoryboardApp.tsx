"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { buildPreviewUrl, canPreview } from "@/lib/aiPreview";
import type { StudioProject } from "@/lib/studio";
import { loadProjects, newProject } from "@/lib/studio";

export default function StoryboardApp() {
  const [project, setProject] = useState<StudioProject | null>(null);
  const [allProjects, setAllProjects] = useState<StudioProject[]>([]);
  const [triggeredAt, setTriggeredAt] = useState<number | null>(null);

  useEffect(() => {
    const projects = loadProjects();
    setAllProjects(projects);
    // 默认加载最新项目
    setProject(projects[0] || newProject());
  }, []);

  const readyShots = useMemo(
    () => (project?.shots.filter(canPreview) || []),
    [project]
  );

  function handleGenerate() {
    setTriggeredAt(Date.now());
  }

  function handleProjectChange(id: string) {
    const p = allProjects.find((pr) => pr.id === id);
    if (p) {
      setProject(p);
      setTriggeredAt(null); // 切换项目清空预览
    }
  }

  if (!project) {
    return (
      <>
        <Navbar />
        <main className="pt-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-400 mb-4">加载中...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* 顶部 */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">🎬 AI分镜板</div>
              <h1 className="text-2xl sm:text-3xl font-bold">{project.name}</h1>
              <p className="text-sm text-gray-400 mt-1">
                {project.shots.length}个镜头 · {project.styleDirection} · {project.aspectRatio}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {allProjects.length > 1 && (
                <select
                  value={project.id}
                  onChange={(e) => handleProjectChange(e.target.value)}
                  className="px-3 py-2 text-sm rounded-lg bg-surface-light border border-border/50 text-white focus:outline-none focus:border-accent"
                >
                  {allProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}（{p.shots.length}镜头）
                    </option>
                  ))}
                </select>
              )}
              <Link
                href="/studio"
                className="px-4 py-2 text-sm rounded-lg bg-surface-light hover:bg-border text-gray-300 transition-colors"
              >
                ← 返回Studio
              </Link>
            </div>
          </div>

          {/* 未触发时的提示框 */}
          {!triggeredAt && (
            <div className="p-8 rounded-2xl bg-gradient-to-br from-accent/10 via-purple-500/10 to-surface border border-accent/30 text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-white/90 mb-3">
                ⚡ 真实AI生成 · 永久免费
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                一键生成 {readyShots.length} 张AI分镜图
              </h2>
              <p className="text-gray-300 mb-6 max-w-xl mx-auto">
                传统分镜师画一套完整分镜需要3天+¥2000-5000
                <br />
                我们 <strong className="text-white">30秒 · ¥0</strong>
              </p>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={readyShots.length === 0}
                className="px-10 py-4 rounded-xl bg-white text-background font-bold text-lg hover:bg-gray-100 disabled:opacity-40 transition-colors shadow-lg"
              >
                {readyShots.length === 0
                  ? "请先在Studio填写镜头"
                  : `🎨 立即生成 ${readyShots.length} 张分镜`}
              </button>
              {readyShots.length === 0 && (
                <p className="text-xs text-gray-500 mt-4">
                  <Link href="/studio" className="text-accent-light underline">
                    去 Studio 编辑镜头 →
                  </Link>
                </p>
              )}
            </div>
          )}

          {/* 分镜网格 */}
          {triggeredAt && (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-400">
                  生成完成 · 点击图片可下载 · 每张独立AI生成
                </div>
                <button
                  type="button"
                  onClick={() => setTriggeredAt(Date.now())}
                  className="text-sm text-accent-light hover:text-white transition-colors"
                >
                  🔄 全部重新生成
                </button>
              </div>
              <StoryboardGrid
                project={project}
                key={triggeredAt}
              />
            </>
          )}

          {/* 引流CTA */}
          <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-semibold text-white mb-1">
                  喜欢这个分镜？真实商业项目用Pro版提示词更稳定
                </h3>
                <p className="text-sm text-gray-400">
                  3072条商业验证过的提示词 + ComfyUI批量工作流
                </p>
              </div>
              <Link
                href="/shop/prompts-pro"
                className="px-6 py-3 rounded-lg bg-white text-background font-medium hover:bg-gray-100 transition-colors"
              >
                ¥99 升级Pro →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function StoryboardGrid({ project }: { project: StudioProject }) {
  const readyShots = project.shots.filter(canPreview);

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {readyShots.map((shot, idx) => {
        const url = buildPreviewUrl(shot, project, {
          seed: Math.floor(Math.random() * 1000000),
        });
        return (
          <figure
            key={shot.id}
            className="rounded-xl overflow-hidden bg-surface border border-border/50 group"
          >
            <div
              className="relative bg-surface-light overflow-hidden"
              style={{
                aspectRatio:
                  project.aspectRatio === "9:16"
                    ? "9 / 16"
                    : project.aspectRatio === "1:1"
                      ? "1 / 1"
                      : project.aspectRatio === "4:5"
                        ? "4 / 5"
                        : project.aspectRatio === "2.35:1"
                          ? "2.35 / 1"
                          : "16 / 9",
              }}
            >
              <LazyImage url={url} alt={shot.label} />
              <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-black/60 backdrop-blur text-[10px] text-white">
                镜头 {String(idx + 1).padStart(2, "0")} · {shot.duration}s
              </div>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/60 backdrop-blur text-[10px] text-white hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100"
              >
                ↓ 下载原图
              </a>
            </div>
            <figcaption className="p-3">
              <div className="text-sm font-medium text-white mb-1">
                {shot.label}
              </div>
              <div className="text-xs text-gray-400 line-clamp-2">
                {shot.subject}
                {shot.action ? ` · ${shot.action}` : ""}
              </div>
              <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-500">
                <span>{shot.emotion || "—"}</span>
              </div>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}

function LazyImage({ url, alt }: { url: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <>
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
            <span className="text-[10px] text-gray-400">AI生成中...</span>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500">
          生成失败，请重试
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </>
  );
}
