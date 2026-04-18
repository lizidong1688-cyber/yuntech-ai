"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  buildImagePrompt,
  buildPreviewUrl,
  canPreview,
  imageQueue,
} from "@/lib/aiPreview";
import type { StudioProject, Shot } from "@/lib/studio";
import { loadProjects, newProject } from "@/lib/studio";

type ShotStatus =
  | { kind: "idle" }
  | { kind: "queued" }
  | { kind: "loading" }
  | { kind: "ready"; imageUrl: string }
  | { kind: "error"; message: string };

export default function StoryboardApp() {
  const [project, setProject] = useState<StudioProject | null>(null);
  const [allProjects, setAllProjects] = useState<StudioProject[]>([]);
  const [statusMap, setStatusMap] = useState<Record<string, ShotStatus>>({});
  const [running, setRunning] = useState(false);
  const runIdRef = useRef<number>(0);

  useEffect(() => {
    const projects = loadProjects();
    setAllProjects(projects);
    setProject(projects[0] || newProject());
  }, []);

  // 组件卸载时取消所有任务+释放blob
  useEffect(() => {
    return () => {
      imageQueue.clear();
      // URL是直接图片URL，无需释放
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const readyShots = (project?.shots.filter(canPreview) || []);
  const completed = Object.values(statusMap).filter(
    (s) => s.kind === "ready"
  ).length;
  const errored = Object.values(statusMap).filter(
    (s) => s.kind === "error"
  ).length;

  const generateAll = useCallback(async () => {
    if (!project) return;
    const shots = project.shots.filter(canPreview);
    if (shots.length === 0) return;

    // 直接URL无需释放

    const thisRunId = Date.now();
    runIdRef.current = thisRunId;

    // 全部标记为queued
    const initial: Record<string, ShotStatus> = {};
    shots.forEach((s) => {
      initial[s.id] = { kind: "queued" };
    });
    setStatusMap(initial);
    setRunning(true);

    // 逐个入队处理
    for (const shot of shots) {
      if (runIdRef.current !== thisRunId) break; // 被取消
      // 当轮到这个镜头时，状态变 loading
      setStatusMap((prev) => ({
        ...prev,
        [shot.id]: { kind: "loading" },
      }));

      const seed = Math.floor(Math.random() * 1_000_000);
      const url = buildPreviewUrl(shot, project, { seed });

      try {
        const imageUrl = await imageQueue.enqueue(shot.id, url);
        if (runIdRef.current !== thisRunId) break;
        setStatusMap((prev) => ({
          ...prev,
          [shot.id]: { kind: "ready", imageUrl },
        }));
      } catch (err) {
        if (runIdRef.current !== thisRunId) break;
        const msg = (err as Error).message || "生成失败";
        if (msg === "cancelled" || msg === "cleared") continue;
        setStatusMap((prev) => ({
          ...prev,
          [shot.id]: { kind: "error", message: msg },
        }));
      }
    }

    setRunning(false);
  }, [project, statusMap]);

  const retryShot = useCallback(
    async (shot: Shot) => {
      if (!project) return;
      setStatusMap((prev) => ({
        ...prev,
        [shot.id]: { kind: "queued" },
      }));
      const seed = Math.floor(Math.random() * 1_000_000);
      const url = buildPreviewUrl(shot, project, { seed });
      try {
        const imageUrl = await imageQueue.enqueue(shot.id, url);
        setStatusMap((prev) => ({
          ...prev,
          [shot.id]: { kind: "ready", imageUrl },
        }));
      } catch (err) {
        const msg = (err as Error).message || "生成失败";
        if (msg === "cancelled" || msg === "cleared") return;
        setStatusMap((prev) => ({
          ...prev,
          [shot.id]: { kind: "error", message: msg },
        }));
      }
    },
    [project]
  );

  function handleProjectChange(id: string) {
    const p = allProjects.find((pr) => pr.id === id);
    if (p) {
      // 停止当前运行
      runIdRef.current = 0;
      imageQueue.clear();
      // 释放blob
      // URL是直接图片URL，无需释放
      setProject(p);
      setStatusMap({});
      setRunning(false);
    }
  }

  if (!project) {
    return (
      <>
        <Navbar />
        <main className="pt-20 min-h-screen flex items-center justify-center">
          <p className="text-gray-400">加载中...</p>
        </main>
      </>
    );
  }

  const hasStarted = Object.keys(statusMap).length > 0;

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

          {/* 未触发时的引导 */}
          {!hasStarted && (
            <div className="p-8 rounded-2xl bg-gradient-to-br from-accent/10 via-purple-500/10 to-surface border border-accent/30 text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-white/90 mb-3">
                ⚡ 真实AI生成 · 永久免费
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                逐一生成 {readyShots.length} 张AI分镜图
              </h2>
              <p className="text-gray-300 mb-2 max-w-xl mx-auto">
                传统分镜师3天+¥2000-5000
              </p>
              <p className="text-gray-400 text-sm mb-6 max-w-xl mx-auto">
                免费AI服务有限流，系统会<strong className="text-white">逐一生成</strong>每张约5-15秒，请耐心等待
              </p>
              <button
                type="button"
                onClick={generateAll}
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

          {/* 进度条 */}
          {hasStarted && (
            <div className="mb-5 p-4 rounded-xl bg-surface border border-border/50">
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <div className="text-sm text-gray-300">
                  进度：<strong className="text-white">{completed}</strong> /{" "}
                  {readyShots.length}
                  {errored > 0 && (
                    <span className="text-red-300 ml-2">
                      · {errored} 张失败
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!running && (
                    <button
                      type="button"
                      onClick={generateAll}
                      className="text-sm text-accent-light hover:text-white transition-colors"
                    >
                      🔄 全部重新生成
                    </button>
                  )}
                  {running && (
                    <span className="text-xs text-accent-light flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-accent-light animate-pulse" />
                      生成中...
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-light overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                  style={{
                    width: `${
                      readyShots.length > 0
                        ? (completed / readyShots.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* 分镜网格 */}
          {hasStarted && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {readyShots.map((shot, idx) => {
                const status = statusMap[shot.id] || { kind: "idle" };
                return (
                  <StoryboardCard
                    key={shot.id}
                    shot={shot}
                    index={idx}
                    project={project}
                    status={status}
                    onRetry={() => retryShot(shot)}
                  />
                );
              })}
            </div>
          )}

          {/* 引流CTA */}
          <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-semibold text-white mb-1">
                  免费AI有限流，想要稳定的商业级生产？
                </h3>
                <p className="text-sm text-gray-400">
                  Pro版含3072条商业验证提示词 + ComfyUI本地批量工作流（无限流）
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

function StoryboardCard({
  shot,
  index,
  project,
  status,
  onRetry,
}: {
  shot: Shot;
  index: number;
  project: StudioProject;
  status: ShotStatus;
  onRetry: () => void;
}) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const aspectStyle = {
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
  };

  function copyPrompt() {
    navigator.clipboard.writeText(buildImagePrompt(shot, project));
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  }

  return (
    <figure className="rounded-xl overflow-hidden bg-surface border border-border/50 group">
      <div
        className="relative bg-surface-light overflow-hidden flex items-center justify-center"
        style={aspectStyle}
      >
        {status.kind === "queued" && (
          <div className="flex flex-col items-center gap-2 p-4 text-center">
            <span className="text-2xl">⏳</span>
            <span className="text-xs text-gray-400">排队中</span>
          </div>
        )}

        {status.kind === "loading" && (
          <div className="flex flex-col items-center gap-2 p-4 text-center">
            <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
            <span className="text-xs text-gray-300 font-medium">AI绘制中</span>
            <span className="text-[10px] text-gray-500">约 5-15 秒</span>
          </div>
        )}

        {status.kind === "error" && (
          <div className="flex flex-col items-center gap-2 p-4 text-center max-w-full">
            <span className="text-2xl">⚠️</span>
            <span className="text-xs text-red-300 font-medium">生成失败</span>
            <span className="text-[10px] text-gray-400 line-clamp-2">
              {status.message}
            </span>
            <div className="flex gap-1 mt-1">
              <button
                type="button"
                onClick={onRetry}
                className="px-2 py-1 text-[10px] rounded bg-accent/20 hover:bg-accent/30 text-accent-light transition-colors"
              >
                重试
              </button>
              <button
                type="button"
                onClick={copyPrompt}
                className="px-2 py-1 text-[10px] rounded bg-surface-light hover:bg-border text-gray-300 transition-colors"
              >
                {copiedPrompt ? "✓" : "复制Prompt"}
              </button>
            </div>
          </div>
        )}

        {status.kind === "ready" && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={status.imageUrl}
              alt={shot.label}
              className="w-full h-full object-cover"
            />
            <a
              href={status.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/60 backdrop-blur text-[10px] text-white hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100"
            >
              ↓ 保存
            </a>
          </>
        )}

        <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-black/60 backdrop-blur text-[10px] text-white">
          镜头 {String(index + 1).padStart(2, "0")} · {shot.duration}s
        </div>
      </div>
      <figcaption className="p-3">
        <div className="text-sm font-medium text-white mb-1">{shot.label}</div>
        <div className="text-xs text-gray-400 line-clamp-2">
          {shot.subject}
          {shot.action ? ` · ${shot.action}` : ""}
        </div>
      </figcaption>
    </figure>
  );
}
