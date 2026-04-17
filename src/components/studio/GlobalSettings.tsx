"use client";

import type {
  StudioProject,
  LightSetup,
  ColorPalette,
  PacingSpeed,
  AspectRatio,
  AIPlatform,
} from "@/lib/studio";
import {
  LIGHT_META,
  PALETTE_META,
  AI_PLATFORMS,
} from "@/lib/studio";

interface Props {
  project: StudioProject;
  onChange: (project: StudioProject) => void;
}

export default function GlobalSettings({ project, onChange }: Props) {
  function update<K extends keyof StudioProject>(
    key: K,
    value: StudioProject[K]
  ) {
    onChange({ ...project, [key]: value });
  }

  return (
    <div className="space-y-4">
      {/* 项目名 */}
      <div>
        <label className="block text-xs text-gray-400 mb-1.5">项目名</label>
        <input
          type="text"
          value={project.name}
          onChange={(e) => update("name", e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-surface-light border border-border/50 text-sm text-white focus:outline-none focus:border-accent"
        />
      </div>

      {/* 目标平台 */}
      <div>
        <label className="block text-xs text-gray-400 mb-1.5">
          目标AI平台
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {AI_PLATFORMS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => update("targetPlatform", p.value)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                project.targetPlatform === p.value
                  ? "bg-accent text-white shadow-lg shadow-accent/30"
                  : "bg-surface-light text-gray-300 hover:bg-border"
              }`}
            >
              {p.flag} {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* 画面比例 + 总时长 */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">画面比例</label>
          <select
            value={project.aspectRatio}
            onChange={(e) =>
              update("aspectRatio", e.target.value as AspectRatio)
            }
            className="w-full px-3 py-2 rounded-lg bg-surface-light border border-border/50 text-sm text-white focus:outline-none focus:border-accent"
          >
            <option value="16:9">16:9 横屏</option>
            <option value="9:16">9:16 竖屏</option>
            <option value="1:1">1:1 方图</option>
            <option value="4:5">4:5 竖长方</option>
            <option value="2.35:1">2.35:1 超宽银幕</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">
            总时长(秒)
          </label>
          <input
            type="number"
            min={1}
            max={120}
            value={project.totalDuration}
            onChange={(e) =>
              update("totalDuration", Number(e.target.value) || 15)
            }
            className="w-full px-3 py-2 rounded-lg bg-surface-light border border-border/50 text-sm text-white focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* 风格方向 */}
      <div>
        <label className="block text-xs text-gray-400 mb-1.5">
          风格方向（关键词）
        </label>
        <input
          type="text"
          value={project.styleDirection}
          onChange={(e) => update("styleDirection", e.target.value)}
          placeholder="例如：电影感、日系小清新、赛博朋克..."
          className="w-full px-3 py-2 rounded-lg bg-surface-light border border-border/50 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent"
        />
      </div>

      {/* 光线 */}
      <div>
        <label className="block text-xs text-gray-400 mb-1.5">光线设置</label>
        <select
          value={project.lighting}
          onChange={(e) => update("lighting", e.target.value as LightSetup)}
          className="w-full px-3 py-2 rounded-lg bg-surface-light border border-border/50 text-sm text-white focus:outline-none focus:border-accent"
        >
          {(Object.keys(LIGHT_META) as LightSetup[]).map((k) => (
            <option key={k} value={k}>
              {LIGHT_META[k].label}
            </option>
          ))}
        </select>
      </div>

      {/* 色彩 */}
      <div>
        <label className="block text-xs text-gray-400 mb-1.5">色彩基调</label>
        <div className="grid grid-cols-2 gap-1.5">
          {(Object.keys(PALETTE_META) as ColorPalette[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => update("palette", k)}
              className={`p-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                project.palette === k
                  ? "bg-accent/20 border-2 border-accent/60 text-white"
                  : "bg-surface-light border-2 border-transparent text-gray-300 hover:border-border"
              }`}
            >
              <span className="flex gap-0.5">
                {PALETTE_META[k].swatch.map((c, i) => (
                  <span
                    key={i}
                    className="w-2.5 h-5 rounded-sm shrink-0"
                    style={{ background: c }}
                  />
                ))}
              </span>
              <span className="truncate">{PALETTE_META[k].label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 节奏 */}
      <div>
        <label className="block text-xs text-gray-400 mb-1.5">节奏</label>
        <div className="grid grid-cols-4 gap-1.5">
          {(
            [
              { v: "slow", label: "缓慢" },
              { v: "medium", label: "中速" },
              { v: "fast", label: "快速" },
              { v: "variable", label: "变奏" },
            ] as { v: PacingSpeed; label: string }[]
          ).map((p) => (
            <button
              key={p.v}
              type="button"
              onClick={() => update("pacing", p.v)}
              className={`px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                project.pacing === p.v
                  ? "bg-accent text-white"
                  : "bg-surface-light text-gray-300 hover:bg-border"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
