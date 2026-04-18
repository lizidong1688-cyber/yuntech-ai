/**
 * AI图像预览引擎
 *
 * 使用 Pollinations.ai 免费公益服务生成图像
 * 关键约束：匿名用户每个IP同时最多1个请求排队（maxAllowed=1）
 * 因此必须串行化所有请求
 */

import type { Shot, StudioProject } from "./studio";
import { PALETTE_META, LIGHT_META, SHOT_SIZE_META, CAMERA_MOVE_META } from "./studio";

// 通过自家代理调用（绕过Pollinations对浏览器的限流）
const PROXY_BASE = "/api/ai-image";

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
    prompt,
    width: String(size.width),
    height: String(size.height),
    seed: String(seed),
  });

  return `${PROXY_BASE}?${params}`;
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
        const resultUrl = await loadImageWithRetry(task.url);
        task.resolve(resultUrl);
      } catch (err) {
        task.reject(err as Error);
      }
      this.queue.shift();
      this.notify();
      // 两个请求之间强制间隔 1.5秒，避开限流
      if (this.queue.length > 0) {
        await sleep(1500);
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

/**
 * 用 <img> 标签加载图片（而非fetch）
 * 原因：Pollinations对带User-Agent+Referer的fetch请求严格限流
 * <img src> 绕开了这个限制
 *
 * 返回原始URL本身（浏览器已缓存），配合seed换图用
 */
async function loadImageWithRetry(
  url: string,
  attempts = 3
): Promise<string> {
  let lastErr: Error | null = null;
  for (let i = 0; i < attempts; i++) {
    try {
      await loadImage(url);
      return url; // 直接返回URL，UI可用于<img src>
    } catch (err) {
      lastErr = err as Error;
      if (i < attempts - 1) {
        await sleep(1500 * (i + 1));
      }
    }
  }
  throw lastErr || new Error("AI生成超时或失败");
}

function loadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const timeout = setTimeout(() => {
      img.src = "";
      reject(new Error("超时（>45秒）"));
    }, 45_000);
    img.onload = () => {
      clearTimeout(timeout);
      // 判断图片是否有效（429 响应体虽小但浏览器也可能当图加载失败）
      if (img.naturalWidth < 50 || img.naturalHeight < 50) {
        reject(new Error("返回无效图像（可能被限流）"));
      } else {
        resolve();
      }
    };
    img.onerror = () => {
      clearTimeout(timeout);
      reject(new Error("加载失败"));
    };
    img.src = url;
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
