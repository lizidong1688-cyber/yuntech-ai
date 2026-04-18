/**
 * AI图像预览引擎
 *
 * 使用 Pollinations.ai 免费公益服务生成图像
 * 关键约束：匿名用户每个IP同时最多1个请求排队（maxAllowed=1）
 * 因此必须串行化所有请求
 */

import type { Shot, StudioProject } from "./studio";
import { PALETTE_META, LIGHT_META, SHOT_SIZE_META, CAMERA_MOVE_META } from "./studio";

const POLLINATIONS_BASE = "https://image.pollinations.ai/prompt";

export interface PreviewSize {
  width: number;
  height: number;
}

export function getSizeForAspect(aspect: string): PreviewSize {
  switch (aspect) {
    case "9:16":
      return { width: 576, height: 1024 };
    case "1:1":
      return { width: 768, height: 768 };
    case "4:5":
      return { width: 640, height: 800 };
    case "2.35:1":
      return { width: 1024, height: 436 };
    case "16:9":
    default:
      return { width: 1024, height: 576 };
  }
}

/**
 * 构建英文Prompt用于AI图像生成
 */
export function buildImagePrompt(
  shot: Shot,
  project: StudioProject
): string {
  const parts: string[] = [];

  parts.push(SHOT_SIZE_META[shot.size].prompt);

  if (shot.move !== "static") {
    parts.push(`captured with ${CAMERA_MOVE_META[shot.move].prompt}`);
  }

  if (shot.subject) {
    const subjectLine = shot.action
      ? `${shot.subject} ${shot.action}`
      : shot.subject;
    parts.push(`of ${subjectLine}`);
  }

  if (shot.environment) {
    parts.push(`in ${shot.environment}`);
  }

  parts.push(LIGHT_META[project.lighting].prompt);
  parts.push(PALETTE_META[project.palette].prompt);

  if (project.styleDirection) {
    parts.push(`${project.styleDirection} style`);
  }

  if (shot.emotion) {
    parts.push(`mood: ${shot.emotion}`);
  }

  parts.push(
    "cinematic, professional photography, high detail, 8k, sharp focus"
  );

  return parts.join(", ");
}

export function buildPreviewUrl(
  shot: Shot,
  project: StudioProject,
  options?: {
    width?: number;
    height?: number;
    seed?: number;
    enhance?: boolean;
  }
): string {
  const prompt = buildImagePrompt(shot, project);
  const size =
    options?.width && options?.height
      ? { width: options.width, height: options.height }
      : getSizeForAspect(project.aspectRatio);

  const seed =
    options?.seed ??
    Math.abs(
      Array.from(shot.id).reduce(
        (h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0,
        0
      )
    ) % 1000000;

  const params = new URLSearchParams({
    width: String(size.width),
    height: String(size.height),
    seed: String(seed),
    nologo: "true",
    enhance: options?.enhance ? "true" : "false",
  });

  return `${POLLINATIONS_BASE}/${encodeURIComponent(prompt)}?${params}`;
}

export function canPreview(shot: Shot): boolean {
  return Boolean(shot.subject?.trim()) || Boolean(shot.action?.trim()) || Boolean(shot.environment?.trim());
}

// ============================================================
// 🔑 串行队列（核心）—— 解决 Pollinations IP限流问题
// ============================================================

type QueueTask = {
  id: string;
  url: string;
  resolve: (blobUrl: string) => void;
  reject: (error: Error) => void;
};

class ImageQueue {
  private queue: QueueTask[] = [];
  private running = false;
  private listeners: Set<(status: QueueStatus) => void> = new Set();

  async enqueue(id: string, url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.queue.push({ id, url, resolve, reject });
      this.notify();
      if (!this.running) this.process();
    });
  }

  cancel(id: string) {
    this.queue = this.queue.filter((t) => {
      if (t.id === id) {
        t.reject(new Error("cancelled"));
        return false;
      }
      return true;
    });
    this.notify();
  }

  clear() {
    this.queue.forEach((t) => t.reject(new Error("cleared")));
    this.queue = [];
    this.notify();
  }

  onStatusChange(cb: (status: QueueStatus) => void): () => void {
    this.listeners.add(cb);
    cb(this.getStatus());
    return () => {
      this.listeners.delete(cb);
    };
  }

  getStatus(): QueueStatus {
    return {
      pending: this.queue.length,
      running: this.running,
      nextId: this.queue[0]?.id,
    };
  }

  private notify() {
    const status = this.getStatus();
    this.listeners.forEach((cb) => cb(status));
  }

  private async process() {
    this.running = true;
    this.notify();

    while (this.queue.length > 0) {
      const task = this.queue[0];
      try {
        const blobUrl = await fetchWithRetry(task.url);
        task.resolve(blobUrl);
      } catch (err) {
        task.reject(err as Error);
      }
      this.queue.shift();
      this.notify();
      // 两个请求之间强制间隔 500ms，更稳
      if (this.queue.length > 0) {
        await sleep(500);
      }
    }

    this.running = false;
    this.notify();
  }
}

export interface QueueStatus {
  pending: number;
  running: boolean;
  nextId?: string;
}

export const imageQueue = new ImageQueue();

async function fetchWithRetry(
  url: string,
  attempts = 3
): Promise<string> {
  let lastErr: Error | null = null;
  for (let i = 0; i < attempts; i++) {
    try {
      const ctrl = new AbortController();
      const timeout = setTimeout(() => ctrl.abort(), 40_000);
      try {
        const res = await fetch(url, { signal: ctrl.signal, cache: "default" });
        if (res.status === 200) {
          const blob = await res.blob();
          if (blob.size > 5000 && blob.type.startsWith("image/")) {
            return URL.createObjectURL(blob);
          }
          throw new Error(`response不是图片: type=${blob.type}, size=${blob.size}`);
        }
        if (res.status === 429) {
          throw new Error("AI服务繁忙（429）");
        }
        throw new Error(`HTTP ${res.status}`);
      } finally {
        clearTimeout(timeout);
      }
    } catch (err) {
      lastErr = err as Error;
      // 每次失败等更久
      if (i < attempts - 1) {
        await sleep(1500 * (i + 1));
      }
    }
  }
  throw lastErr || new Error("生成失败");
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
