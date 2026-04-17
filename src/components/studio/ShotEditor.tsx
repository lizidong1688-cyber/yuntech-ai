"use client";

import { useState } from "react";
import type {
  Shot,
  ShotSize,
  CameraMove,
  StudioProject,
} from "@/lib/studio";
import { SHOT_SIZE_META, CAMERA_MOVE_META } from "@/lib/studio";
import { buildPreviewUrl, canPreview } from "@/lib/aiPreview";

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
  const [previewToken, setPreviewToken] = useState(0); // 点击"重新生成"递增
  const [showPreview, setShowPreview] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);

  function update<K extends keyof Shot>(key: K, value: Shot[K]) {
    onChange({ ...shot, [key]: value });
  }

  const ready = canPreview(shot);
  const previewUrl = ready
    ? buildPreviewUrl(shot, project, { seed: previewToken })
    : "";

  function handleGenerate() {
    if (!ready) return;
    setShowPreview(true);
    setImgLoading(true);
    // 强制刷新（换seed）
    setPreviewToken((t) => t + Date.now() % 1000);
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
          {/* 景别 + 运镜 + 时长 */}
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

          {/* 内容字段 */}
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
            {showPreview && (
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!ready}
                className="text-[10px] text-accent-light hover:text-white transition-colors"
              >
                🎲 换一张
              </button>
            )}
          </div>

          {!showPreview ? (
            <button
              type="button"
              onClick={handleGenerate}
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
                {ready ? "约 2-3 秒" : ""}
              </span>
            </button>
          ) : (
            <div className="relative aspect-square rounded-lg overflow-hidden bg-surface-light border border-border/50">
              {imgLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                    <span className="text-[10px] text-gray-400">AI生成中...</span>
                  </div>
                </div>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={previewUrl}
                src={previewUrl}
                alt={shot.label}
                className="w-full h-full object-cover"
                onLoad={() => setImgLoading(false)}
                onError={() => setImgLoading(false)}
              />
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                download={`${shot.label}.jpg`}
                className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/60 backdrop-blur text-[10px] text-white hover:bg-black/80 transition-colors"
              >
                ↓ 保存
              </a>
            </div>
          )}
        </div>
      </div>
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
