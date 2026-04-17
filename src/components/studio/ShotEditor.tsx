"use client";

import type { Shot, ShotSize, CameraMove } from "@/lib/studio";
import { SHOT_SIZE_META, CAMERA_MOVE_META } from "@/lib/studio";

interface Props {
  shot: Shot;
  index: number;
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
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: Props) {
  function update<K extends keyof Shot>(key: K, value: Shot[K]) {
    onChange({ ...shot, [key]: value });
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
            onChange={(e) => update("duration", Number(e.target.value) || 3)}
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
