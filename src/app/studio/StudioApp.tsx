"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ShotEditor from "@/components/studio/ShotEditor";
import GlobalSettings from "@/components/studio/GlobalSettings";
import PreviewPanel from "@/components/studio/PreviewPanel";
import ProjectHistory from "@/components/studio/ProjectHistory";
import type { StudioProject, Shot } from "@/lib/studio";
import {
  newProject,
  newShot,
  saveProject,
  encodeProjectToURL,
  decodeProjectFromURL,
} from "@/lib/studio";

export default function StudioApp() {
  const [project, setProject] = useState<StudioProject>(newProject);
  const [historyKey, setHistoryKey] = useState(0);
  const [autoSaved, setAutoSaved] = useState(false);

  // 解析URL中的分享项目
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (hash.startsWith("#p=")) {
      const encoded = hash.slice(3);
      const loaded = decodeProjectFromURL(encoded);
      if (loaded) {
        setProject(loaded);
      }
    }
  }, []);

  // 自动保存
  useEffect(() => {
    const timer = setTimeout(() => {
      // 有任一镜头填了主体才保存
      if (project.shots.some((s) => s.subject.trim())) {
        saveProject(project);
        setHistoryKey((k) => k + 1);
        setAutoSaved(true);
        setTimeout(() => setAutoSaved(false), 1500);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [project]);

  const updateProject = useCallback((p: StudioProject) => {
    setProject(p);
  }, []);

  const updateShot = useCallback(
    (idx: number, shot: Shot) => {
      const newShots = [...project.shots];
      newShots[idx] = shot;
      setProject({ ...project, shots: newShots });
    },
    [project]
  );

  const deleteShot = useCallback(
    (idx: number) => {
      setProject({
        ...project,
        shots: project.shots.filter((_, i) => i !== idx),
      });
    },
    [project]
  );

  const moveShot = useCallback(
    (idx: number, direction: "up" | "down") => {
      const newShots = [...project.shots];
      const target = direction === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= newShots.length) return;
      [newShots[idx], newShots[target]] = [newShots[target], newShots[idx]];
      setProject({ ...project, shots: newShots });
    },
    [project]
  );

  const addShot = useCallback(() => {
    setProject({
      ...project,
      shots: [...project.shots, newShot(project.shots.length + 1)],
    });
  }, [project]);

  const handleNew = useCallback(() => {
    if (!confirm("新建项目会丢失当前未保存的变更，确定吗？")) return;
    setProject(newProject());
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  const handleLoad = useCallback((p: StudioProject) => {
    setProject(p);
  }, []);

  const getShareUrl = useCallback(() => {
    const encoded = encodeProjectToURL(project);
    const base =
      typeof window !== "undefined"
        ? `${window.location.origin}/studio`
        : "/studio";
    return `${base}#p=${encoded}`;
  }, [project]);

  const totalDur = useMemo(
    () => project.shots.reduce((sum, s) => sum + s.duration, 0),
    [project.shots]
  );

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* 顶部标题栏 */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <span>🎬 AI Prompt Studio</span>
                {autoSaved && (
                  <span className="text-green-400">✓ 已自动保存</span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                {project.name}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleNew}
                className="px-4 py-2 text-sm rounded-lg bg-surface-light hover:bg-border text-gray-300 transition-colors"
              >
                新建项目
              </button>
              <Link
                href="/shop/prompts-pro"
                className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:shadow-lg hover:shadow-orange-500/30 transition-all"
              >
                ⚡ 升级Pro解锁3072条
              </Link>
            </div>
          </div>

          {/* 3列布局：左侧全局设置 / 中间镜头序列 / 右侧预览 */}
          <div className="grid lg:grid-cols-[280px_1fr_380px] gap-5">
            {/* 左侧：全局设置 */}
            <aside className="space-y-5">
              <div className="p-4 rounded-xl bg-surface/80 backdrop-blur border border-border/50 sticky top-24">
                <h2 className="text-sm font-semibold mb-4">全局设置</h2>
                <GlobalSettings project={project} onChange={updateProject} />
              </div>
              <ProjectHistory
                currentId={project.id}
                onLoad={handleLoad}
                refreshKey={historyKey}
              />
            </aside>

            {/* 中间：镜头序列 */}
            <section>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="text-sm font-semibold">
                  镜头序列 · {project.shots.length} 个镜头 · 总 {totalDur.toFixed(1)}s
                </h2>
                <div className="flex items-center gap-2">
                  <Link
                    href="/storyboard"
                    className="px-4 py-1.5 text-sm rounded-lg bg-gradient-to-r from-accent to-purple-600 hover:from-accent-light hover:to-purple-500 text-white font-medium transition-all"
                    onClick={() => saveProject(project)}
                  >
                    🎬 查看分镜板
                  </Link>
                  <button
                    type="button"
                    onClick={addShot}
                    className="px-4 py-1.5 text-sm rounded-lg bg-accent/20 hover:bg-accent/30 text-accent-light transition-colors"
                  >
                    + 添加镜头
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {project.shots.map((shot, idx) => (
                  <ShotEditor
                    key={shot.id}
                    shot={shot}
                    index={idx}
                    project={project}
                    onChange={(s) => updateShot(idx, s)}
                    onDelete={() => deleteShot(idx)}
                    onMoveUp={() => moveShot(idx, "up")}
                    onMoveDown={() => moveShot(idx, "down")}
                    canMoveUp={idx > 0}
                    canMoveDown={idx < project.shots.length - 1}
                  />
                ))}
                {project.shots.length === 0 && (
                  <div className="p-10 rounded-xl bg-surface/50 border border-dashed border-border/50 text-center text-sm text-gray-500">
                    还没有镜头。点击右上角「添加镜头」开始创作。
                  </div>
                )}
              </div>
            </section>

            {/* 右侧：预览 */}
            <aside>
              <div className="sticky top-24">
                <div className="p-4 rounded-xl bg-surface/80 backdrop-blur border border-border/50">
                  <h2 className="text-sm font-semibold mb-4">实时预览</h2>
                  <PreviewPanel project={project} onShareUrl={getShareUrl} />
                </div>

                {/* 引流到商品 */}
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30">
                  <div className="text-xs text-white font-medium mb-2">
                    💡 3072 条现成提示词
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
                    手动构建太慢？Pro用户可以直接从3072条商业级提示词中挑选套用
                  </p>
                  <Link
                    href="/shop/prompts-pro"
                    className="block text-center py-2 rounded-lg bg-white text-background text-xs font-medium hover:bg-gray-100 transition-colors"
                  >
                    查看 ¥99 Pro版 →
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
