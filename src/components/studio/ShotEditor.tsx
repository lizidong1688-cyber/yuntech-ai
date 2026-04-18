"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  Shot,
  ShotSize,
  CameraMove,
  StudioProject,
} from "@/lib/studio";
import { SHOT_SIZE_META, CAMERA_MOVE_META } from "@/lib/studio";
import {
  buildPreviewUrl,
  canPreview,
  imageQueue,
  buildImagePrompt,
} from "@/lib/aiPreview";

interface Props {
  shot: Shot;
  index: number;
  project: StudioProject;
  onChange: (shot: Shot) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

type PreviewState =
  | { kind: "idle" }
  | { kind: "queued" }
  | { kind: "loading" }
  | { kind: "ready"; blobUrl: string }
  | { kind: "error"; message: string };

export default function ShotEditor({
  shot,
  index,
  project,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: Props) {
  const [preview, setPreview] = useState<PreviewState>({ kind: "idle" });
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const ready = canPreview(shot);

  // 取消正在进行的任务
  useEffect(() => {
    return () => {
      imageQueue.cancel(shot.id);
      if (preview.kind === "ready") {
        URL.revokeObjectURL(preview.blobUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update<K extends keyof Shot>(key: K, value: Shot[K]) {
    onChange({ ...shot, [key]: value });
  }

  const generate = useCallback(async () => {
    if (!ready) return;
    // 释放旧blob
    if (preview.kind === "ready") {
      URL.revokeObjectURL(preview.blobUrl);
    }
    // 先入队
    setPreview({ kind: "queued" });
    const seed = Math.floor(Math.random() * 1_000_000);
    const url = buildPreviewUrl(shot, project, { seed });
    try {
      // 进入队列，队列开始处理时状态转 loading
      const start = Date.now();
      const blobUrl = await imageQueue.enqueue(shot.id, url);
      // 如果取到结果用时很短，说明已经是loading了；无关紧要
      void start;
      setPreview({ kind: "ready", blobUrl });
    } catch (err) {
      const msg = (err as Error).message || "生成失败";
      if (msg === "cancelled" || msg === "cleared") return;
      setPreview({ kind: "error", message: msg });
    }
  }, [ready, shot, project, preview]);

  // 订阅队列状态，更新 loading 态
  useEffect(() => {
    const unsub = imageQueue.onStatusChange((status) => {
      if (status.nextId === shot.id && status.running && preview.kind === "queued") {
        setPreview({ kind: "loading" });
      }
    });
    return unsub;
  }, [shot.id, preview.kind]);

  function copyPrompt() {
    navigator.clipboard.writeText(buildImagePrompt(shot, project));
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  }

  return (
    <div className="p-4 rounded-xl bg-surface border border-border/50 hover:border-accent/30 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="shrink-0 w-7 h-7 rounded-lg bg-accent/20 text-accent-light text-xs flex items-center justify-center font-bold">
            {String(index + 1).padStart(2, "0")}
          </span>
          <input
            type="text"
            value={shot.label}
            onChange={(e) => update("label", e.target.value)}
            className="bg-transparent border-none text-sm font-medium text-white focus:outline-none focus:ring-1 focus:ring-accent rounded px-2"
          />
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="w-7 h-7 rounded-md text-gray-500 hover:bg-surface-light hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="上移"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="w-7 h-7 rounded-md text-gray-500 hover:bg-surface-light hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="下移"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="w-7 h-7 rounded-md text-gray-500 hover:bg-red-500/20 hover:text-red-300 transition-colors"
            title="删除"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-4">
        {/* 左：表单 */}
        <div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                景别
              </label>
              <select
                value={shot.size}
                onChange={(e) => update("size", e.target.value as ShotSize)}
                className="w-full px-2 py-2 rounded-lg bg-surface-light border border-border/50 text-xs text-white focus:outline-none focus:border-accent"
              >
                {(Object.keys(SHOT_SIZE_META) as ShotSize[]).map((k) => (
                  <option key={k} value={k}>
                    {SHOT_SIZE_META[k].icon} {SHOT_SIZE_META[k].label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                运镜
              </label>
              <select
                value={shot.move}
                onChange={(e) => update("move", e.target.value as CameraMove)}
                className="w-full px-2 py-2 rounded-lg bg-surface-light border border-border/50 text-xs text-white focus:outline-none focus:border-accent"
              >
                {(Object.keys(CAMERA_MOVE_META) as CameraMove[]).map((k) => (
                  <option key={k} value={k}>
                    {CAMERA_MOVE_META[k].label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                时长(秒)
              </label>
              <input
                type="number"
                min={1}
                max={60}
                step={0.5}
                value={shot.duration}
                onChange={(e) =>
                  update("duration", Number(e.target.value) || 3)
                }
                className="w-full px-2 py-2 rounded-lg bg-surface-light border border-border/50 text-xs text-white focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Field
              label="主体"
              value={shot.subject}
              onChange={(v) => update("subject", v)}
              placeholder="例如：25岁咖啡师女孩，围裙，黑发扎起"
            />
            <Field
              label="动作"
              value={shot.action}
              onChange={(v) => update("action", v)}
              placeholder="例如：专注地打奶泡，然后抬头微笑"
            />
            <Field
              label="环境"
              value={shot.environment}
              onChange={(v) => update("environment", v)}
              placeholder="例如：木质吧台，晨光透过窗户"
            />
            <Field
              label="情绪"
              value={shot.emotion}
              onChange={(v) => update("emotion", v)}
              placeholder="例如：温暖、治愈"
            />
          </div>
        </div>

        {/* 右：AI预览 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">
              AI预览
            </span>
            {preview.kind === "ready" && (
              <button
                type="button"
                onClick={generate}
                className="text-[10px] text-accent-light hover:text-white transition-colors"
              >
                🎲 换一张
              </button>
            )}
          </div>

          <PreviewBox
            state={preview}
            ready={ready}
            onGenerate={generate}
          />

          {/* 失败降级：复制prompt手动用 */}
          {preview.kind === "error" && (
            <button
              type="button"
              onClick={copyPrompt}
              className="w-full py-2 text-[11px] rounded-md bg-surface-light hover:bg-border text-gray-300 transition-colors"
            >
              {copiedPrompt
                ? "✓ 已复制英文Prompt"
                : "📋 复制Prompt去其他平台"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function PreviewBox({
  state,
  ready,
  onGenerate,
}: {
  state: PreviewState;
  ready: boolean;
  onGenerate: () => void;
}) {
  if (state.kind === "idle") {
    return (
      <button
        type="button"
        onClick={onGenerate}
        disabled={!ready}
        className="w-full aspect-square rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-2 border-dashed border-border/50 hover:border-accent/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex flex-col items-center justify-center gap-2 group"
      >
        <svg
          className="w-8 h-8 text-accent-light group-hover:scale-110 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        <span className="text-xs text-gray-300 font-medium">
          {ready ? "生成AI预览" : "先填写主体或动作"}
        </span>
        <span className="text-[10px] text-gray-500">
          {ready ? "约 3-10 秒" : ""}
        </span>
      </button>
    );
  }

  if (state.kind === "queued" || state.kind === "loading") {
    return (
      <div className="w-full aspect-square rounded-lg bg-surface-light border border-border/50 flex flex-col items-center justify-center gap-2">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        <span className="text-[11px] text-gray-400">
          {state.kind === "queued" ? "⏳ 排队中..." : "🎨 AI绘制中..."}
        </span>
        <span className="text-[10px] text-gray-500">
          {state.kind === "queued" ? "前面有其他镜头" : "最多等40秒"}
        </span>
      </div>
    );
  }

  if (state.kind === "error") {
    return (
      <div className="w-full aspect-square rounded-lg bg-red-500/5 border-2 border-red-500/30 flex flex-col items-center justify-center gap-2 p-3 text-center">
        <svg
          className="w-8 h-8 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span className="text-[11px] text-red-300 font-medium">生成失败</span>
        <span className="text-[10px] text-gray-400 leading-tight">
          {state.message}
        </span>
        <button
          type="button"
          onClick={onGenerate}
          className="mt-1 px-3 py-1 text-[10px] rounded-md bg-accent/20 hover:bg-accent/30 text-accent-light transition-colors"
        >
          重试
        </button>
      </div>
    );
  }

  // ready
  return (
    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-light border border-border/50 group">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={state.blobUrl}
        alt="AI预览"
        className="w-full h-full object-cover"
      />
      <a
        href={state.blobUrl}
        download="yuntech-ai-preview.jpg"
        className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/60 backdrop-blur text-[10px] text-white hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100"
      >
        ↓ 保存
      </a>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="shrink-0 w-10 text-[11px] text-gray-500 pt-2">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-3 py-2 rounded-lg bg-surface-light border border-border/30 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-accent/50 transition-colors"
      />
    </div>
  );
}
