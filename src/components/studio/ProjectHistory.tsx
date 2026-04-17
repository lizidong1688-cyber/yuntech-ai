"use client";

import { useEffect, useState } from "react";
import type { StudioProject } from "@/lib/studio";
import { loadProjects, deleteProject } from "@/lib/studio";

interface Props {
  currentId: string;
  onLoad: (project: StudioProject) => void;
  refreshKey: number;
}

export default function ProjectHistory({
  currentId,
  onLoad,
  refreshKey,
}: Props) {
  const [projects, setProjects] = useState<StudioProject[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setProjects(loadProjects());
  }, [refreshKey]);

  function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    if (!confirm("确定删除这个项目？此操作不可撤销。")) return;
    deleteProject(id);
    setProjects(loadProjects());
  }

  if (projects.length === 0) return null;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors w-full text-left mb-2"
      >
        <span>{open ? "▾" : "▸"}</span>
        <span>历史项目 ({projects.length})</span>
      </button>
      {open && (
        <div className="space-y-1.5 max-h-64 overflow-auto">
          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onLoad(p)}
              className={`w-full text-left p-2 rounded-lg transition-all group flex items-start gap-2 ${
                p.id === currentId
                  ? "bg-accent/20 border border-accent/50"
                  : "bg-surface-light/50 border border-transparent hover:border-border"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-white truncate">
                  {p.name}
                </div>
                <div className="text-[10px] text-gray-500 flex items-center gap-2">
                  <span>{p.shots.length}镜头</span>
                  <span>·</span>
                  <span>{p.totalDuration}s</span>
                  <span>·</span>
                  <span>
                    {new Date(p.updatedAt).toLocaleDateString("zh-CN", {
                      month: "numeric",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => handleDelete(e, p.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all text-xs px-1"
              >
                ✕
              </button>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
