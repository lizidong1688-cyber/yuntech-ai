/**
 * AI图像预览引擎
 *
 * 使用 Pollinations.ai 免费公益服务生成图像
 * - 零API成本
 * - 无需Key
 * - 支持seed保证重现性
 * - 可直接 <img src> 引用
 */

import type {
  Shot,
  StudioProject,
  ColorPalette,
  LightSetup,
} from "./studio";
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
 * （Pollinations对英文响应更好）
 */
export function buildImagePrompt(
  shot: Shot,
  project: StudioProject
): string {
  const parts: string[] = [];

  // 1. 景别（先说镜头类型）
  parts.push(SHOT_SIZE_META[shot.size].prompt);

  // 2. 运镜提示（帮助AI理解构图）
  if (shot.move !== "static") {
    parts.push(`captured with ${CAMERA_MOVE_META[shot.move].prompt}`);
  }

  // 3. 主体+动作（核心内容）
  if (shot.subject) {
    const subjectLine = shot.action
      ? `${shot.subject} ${shot.action}`
      : shot.subject;
    parts.push(`of ${subjectLine}`);
  }

  // 4. 环境
  if (shot.environment) {
    parts.push(`in ${shot.environment}`);
  }

  // 5. 光线
  parts.push(LIGHT_META[project.lighting].prompt);

  // 6. 色彩
  parts.push(PALETTE_META[project.palette].prompt);

  // 7. 风格（来自用户自由输入）
  if (project.styleDirection) {
    parts.push(`${project.styleDirection} style`);
  }

  // 8. 情绪
  if (shot.emotion) {
    parts.push(`mood: ${shot.emotion}`);
  }

  // 9. 质量锚点
  parts.push(
    "cinematic, professional photography, high detail, 8k, sharp focus"
  );

  return parts.join(", ");
}

/**
 * 生成预览图URL（可直接用于<img src>）
 *
 * seed 基于shot ID保证同一镜头刷新仍是同一张图
 * 修改prompt会自动变化图（因为URL变了）
 */
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

  // 基于shot ID生成稳定seed
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

/**
 * 判断镜头是否足够完整可以生成预览
 */
export function canPreview(shot: Shot): boolean {
  return Boolean(shot.subject?.trim()) || Boolean(shot.action?.trim()) || Boolean(shot.environment?.trim());
}
