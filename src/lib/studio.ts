/**
 * AI Prompt Studio · 数据模型与引擎
 *
 * 这是一个纯客户端、无需登录的专业AI视频提示词工作室
 * 所有状态保存在浏览器localStorage，支持URL分享、多AI平台导出
 */

// ============================================================
// 核心类型
// ============================================================

export type CameraMove =
  | "static"
  | "pan-left"
  | "pan-right"
  | "tilt-up"
  | "tilt-down"
  | "zoom-in"
  | "zoom-out"
  | "dolly-in"
  | "dolly-out"
  | "orbit"
  | "tracking"
  | "crane"
  | "handheld"
  | "fpv";

export type ShotSize =
  | "extreme-close"
  | "close-up"
  | "medium-close"
  | "medium"
  | "medium-wide"
  | "wide"
  | "extreme-wide"
  | "overhead"
  | "pov";

export type LightSetup =
  | "golden-hour"
  | "blue-hour"
  | "studio-soft"
  | "hard-side"
  | "rim-light"
  | "natural-window"
  | "neon"
  | "volumetric"
  | "candlelight"
  | "backlit"
  | "overcast"
  | "dramatic-top";

export type ColorPalette =
  | "warm-amber"
  | "cool-blue"
  | "teal-orange"
  | "monochrome"
  | "pastel"
  | "vibrant"
  | "muted-earth"
  | "high-contrast"
  | "cyberpunk"
  | "sepia";

export type AIPlatform =
  | "wan"
  | "sora"
  | "runway"
  | "pika"
  | "kling"
  | "vidu"
  | "luma";

export type AspectRatio = "16:9" | "9:16" | "1:1" | "4:5" | "2.35:1";

export type PacingSpeed = "slow" | "medium" | "fast" | "variable";

export interface Shot {
  id: string;
  label: string;
  duration: number; // seconds
  size: ShotSize;
  move: CameraMove;
  subject: string; // 主体描述
  action: string; // 动作
  environment: string; // 环境/场景
  emotion: string; // 情绪
  notes?: string;
}

export interface StudioProject {
  id: string;
  name: string;
  // 全局设置
  aspectRatio: AspectRatio;
  totalDuration: number;
  lighting: LightSetup;
  palette: ColorPalette;
  pacing: PacingSpeed;
  styleDirection: string; // 自由文字，如"电影感"、"日系小清新"
  musicalTone: string; // 配乐基调
  targetPlatform: AIPlatform;
  // 镜头序列
  shots: Shot[];
  // 元信息
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 标签映射（英文prompt需要精确术语）
// ============================================================

export const SHOT_SIZE_META: Record<
  ShotSize,
  { label: string; prompt: string; icon: string }
> = {
  "extreme-close": { label: "极端特写", prompt: "extreme close-up, macro detail", icon: "🔬" },
  "close-up": { label: "特写", prompt: "close-up shot, intimate framing", icon: "👁️" },
  "medium-close": { label: "中近景", prompt: "medium close-up", icon: "🪞" },
  medium: { label: "中景", prompt: "medium shot, waist up", icon: "👤" },
  "medium-wide": { label: "中远景", prompt: "medium wide shot, full body", icon: "🧍" },
  wide: { label: "远景", prompt: "wide shot, establishing", icon: "🏞️" },
  "extreme-wide": { label: "大远景", prompt: "extreme wide shot, epic scale", icon: "🌄" },
  overhead: { label: "俯视", prompt: "overhead shot, bird's eye view", icon: "🦅" },
  pov: { label: "主观", prompt: "first-person POV", icon: "👓" },
};

export const CAMERA_MOVE_META: Record<
  CameraMove,
  { label: string; prompt: string }
> = {
  static: { label: "固定", prompt: "static camera, locked off" },
  "pan-left": { label: "左摇", prompt: "slow pan left" },
  "pan-right": { label: "右摇", prompt: "slow pan right" },
  "tilt-up": { label: "仰摇", prompt: "tilt up revealing" },
  "tilt-down": { label: "俯摇", prompt: "tilt down" },
  "zoom-in": { label: "推焦", prompt: "slow zoom in, building tension" },
  "zoom-out": { label: "拉焦", prompt: "zoom out revealing scale" },
  "dolly-in": { label: "推轨", prompt: "dolly in, smooth push" },
  "dolly-out": { label: "拉轨", prompt: "dolly out, smooth pull back" },
  orbit: { label: "环绕", prompt: "orbit around subject, 360 motion" },
  tracking: { label: "跟拍", prompt: "tracking shot, following subject" },
  crane: { label: "升降", prompt: "crane shot, rising reveal" },
  handheld: { label: "手持", prompt: "handheld camera, organic motion" },
  fpv: { label: "FPV", prompt: "FPV drone shot, dynamic swoop" },
};

export const LIGHT_META: Record<LightSetup, { label: string; prompt: string }> =
  {
    "golden-hour": {
      label: "黄金时刻",
      prompt: "golden hour lighting, warm sunset glow",
    },
    "blue-hour": {
      label: "蓝调时刻",
      prompt: "blue hour twilight, deep atmospheric blue",
    },
    "studio-soft": {
      label: "柔光棚",
      prompt: "soft diffused studio lighting, even exposure",
    },
    "hard-side": {
      label: "硬侧光",
      prompt: "hard sidelight, dramatic shadows",
    },
    "rim-light": {
      label: "轮廓光",
      prompt: "strong rim light outlining subject",
    },
    "natural-window": {
      label: "窗光",
      prompt: "natural window light, Rembrandt-style",
    },
    neon: { label: "霓虹", prompt: "neon lighting, cyberpunk color" },
    volumetric: {
      label: "体积光",
      prompt: "volumetric light rays cutting through atmosphere",
    },
    candlelight: {
      label: "烛光",
      prompt: "candlelight, intimate warm glow",
    },
    backlit: { label: "逆光", prompt: "backlit silhouette, halo effect" },
    overcast: { label: "阴天", prompt: "overcast diffused daylight" },
    "dramatic-top": {
      label: "顶光",
      prompt: "dramatic overhead light, chiaroscuro",
    },
  };

export const PALETTE_META: Record<
  ColorPalette,
  { label: string; prompt: string; swatch: string[] }
> = {
  "warm-amber": {
    label: "暖琥珀",
    prompt: "warm amber tones, orange highlights",
    swatch: ["#FFA94D", "#D9480F", "#C92A2A"],
  },
  "cool-blue": {
    label: "冷青",
    prompt: "cool blue palette, cyan shadows",
    swatch: ["#4DABF7", "#1971C2", "#0B3A5E"],
  },
  "teal-orange": {
    label: "青橙",
    prompt: "teal and orange cinematic grade",
    swatch: ["#20C997", "#FF922B", "#E8590C"],
  },
  monochrome: {
    label: "单色",
    prompt: "monochromatic palette, controlled saturation",
    swatch: ["#F1F3F5", "#868E96", "#212529"],
  },
  pastel: {
    label: "粉彩",
    prompt: "soft pastel colors, dreamy",
    swatch: ["#FFA8A8", "#FFD6A5", "#CAF5CA"],
  },
  vibrant: {
    label: "高饱和",
    prompt: "vibrant saturated colors, pop art energy",
    swatch: ["#FF006E", "#8338EC", "#3A86FF"],
  },
  "muted-earth": {
    label: "莫兰迪",
    prompt: "muted earth tones, Morandi palette",
    swatch: ["#B08968", "#7F5539", "#DDB892"],
  },
  "high-contrast": {
    label: "高对比",
    prompt: "high contrast, crushed blacks bright highlights",
    swatch: ["#000000", "#F8F9FA", "#E8590C"],
  },
  cyberpunk: {
    label: "赛博朋克",
    prompt: "cyberpunk neon pink and cyan",
    swatch: ["#FF006E", "#00F5FF", "#8338EC"],
  },
  sepia: {
    label: "褪色",
    prompt: "sepia washed film look, nostalgic",
    swatch: ["#C9A97C", "#8C6A3A", "#3A2817"],
  },
};

// ============================================================
// 镜头生成器（给新项目提供合理默认）
// ============================================================

export function newShot(idx = 1): Shot {
  return {
    id: `shot-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    label: `镜头 ${idx}`,
    duration: 3,
    size: "medium",
    move: "static",
    subject: "",
    action: "",
    environment: "",
    emotion: "",
  };
}

export function newProject(): StudioProject {
  return {
    id: `proj-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: "未命名项目",
    aspectRatio: "16:9",
    totalDuration: 15,
    lighting: "golden-hour",
    palette: "teal-orange",
    pacing: "medium",
    styleDirection: "电影感",
    musicalTone: "",
    targetPlatform: "wan",
    shots: [
      { ...newShot(1), subject: "主角", action: "缓步前行", environment: "清晨的城市街道", emotion: "坚定" },
      { ...newShot(2), subject: "产品/核心元素", action: "特写展现", environment: "自然光下的桌面", emotion: "专注" },
      { ...newShot(3), subject: "情感高潮", action: "定格画面", environment: "前景清晰背景虚化", emotion: "共鸣" },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ============================================================
// 提示词编译器（核心逻辑）
// ============================================================

const PACING_META: Record<PacingSpeed, string> = {
  slow: "slow contemplative pacing",
  medium: "steady rhythm",
  fast: "quick cuts, high energy",
  variable: "dynamic pacing with pauses",
};

/**
 * 编译为目标平台的Prompt
 */
export function compilePrompt(
  project: StudioProject,
  platform: AIPlatform = project.targetPlatform
): string {
  const header = compileHeader(project);
  const shots = project.shots
    .map((s, idx) => compileShot(s, idx + 1, platform))
    .filter(Boolean)
    .join("\n\n");

  switch (platform) {
    case "wan":
    case "kling":
    case "vidu":
      // 国产平台，中英混合更友好
      return [
        `风格：${project.styleDirection}`,
        `画面比例：${project.aspectRatio}`,
        `总时长：${project.totalDuration}秒`,
        `色彩基调：${PALETTE_META[project.palette].prompt}`,
        `光线：${LIGHT_META[project.lighting].prompt}`,
        `节奏：${PACING_META[project.pacing]}`,
        "",
        "分镜：",
        shots,
      ].join("\n");

    case "sora":
    case "runway":
    case "pika":
    case "luma":
      // 英文主导
      return [
        `[${project.aspectRatio}, ${project.totalDuration}s total]`,
        header,
        shots,
      ].join("\n\n");

    default:
      return `${header}\n\n${shots}`;
  }
}

function compileHeader(p: StudioProject): string {
  return [
    `Style: ${p.styleDirection}`,
    `Color: ${PALETTE_META[p.palette].prompt}`,
    `Lighting: ${LIGHT_META[p.lighting].prompt}`,
    `Pacing: ${PACING_META[p.pacing]}`,
  ].join(". ");
}

function compileShot(shot: Shot, idx: number, platform: AIPlatform): string {
  if (!shot.subject && !shot.action) return "";
  const size = SHOT_SIZE_META[shot.size].prompt;
  const move = CAMERA_MOVE_META[shot.move].prompt;

  if (platform === "wan" || platform === "kling" || platform === "vidu") {
    return [
      `镜头 ${idx}（${shot.duration}秒）`,
      `  景别：${SHOT_SIZE_META[shot.size].label}`,
      `  运镜：${CAMERA_MOVE_META[shot.move].label}`,
      `  主体：${shot.subject}`,
      shot.action ? `  动作：${shot.action}` : "",
      shot.environment ? `  环境：${shot.environment}` : "",
      shot.emotion ? `  情绪：${shot.emotion}` : "",
      shot.notes ? `  备注：${shot.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  return [
    `Shot ${idx} [${shot.duration}s]:`,
    `  ${size}, ${move}.`,
    `  Subject: ${shot.subject}${shot.action ? ", " + shot.action : ""}.`,
    shot.environment ? `  Environment: ${shot.environment}.` : "",
    shot.emotion ? `  Mood: ${shot.emotion}.` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export const NEGATIVE_PROMPT =
  "blurry, low quality, distorted, watermark, text artifacts, extra limbs, bad anatomy, flickering, jittering";

// ============================================================
// URL分享编码
// ============================================================

export function encodeProjectToURL(project: StudioProject): string {
  const minimal = {
    n: project.name,
    a: project.aspectRatio,
    d: project.totalDuration,
    l: project.lighting,
    p: project.palette,
    pc: project.pacing,
    sd: project.styleDirection,
    mt: project.musicalTone,
    tp: project.targetPlatform,
    s: project.shots.map((s) => ({
      l: s.label,
      d: s.duration,
      sz: s.size,
      mv: s.move,
      su: s.subject,
      ac: s.action,
      en: s.environment,
      em: s.emotion,
      nt: s.notes,
    })),
  };
  const json = JSON.stringify(minimal);
  const compressed = btoa(unescape(encodeURIComponent(json)));
  return compressed;
}

export function decodeProjectFromURL(encoded: string): StudioProject | null {
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    const minimal = JSON.parse(json);
    return {
      id: `proj-${Date.now()}`,
      name: minimal.n || "共享项目",
      aspectRatio: minimal.a || "16:9",
      totalDuration: minimal.d || 15,
      lighting: minimal.l || "golden-hour",
      palette: minimal.p || "teal-orange",
      pacing: minimal.pc || "medium",
      styleDirection: minimal.sd || "电影感",
      musicalTone: minimal.mt || "",
      targetPlatform: minimal.tp || "wan",
      shots: (minimal.s || []).map((s: Record<string, unknown>, i: number) => ({
        id: `shot-${Date.now()}-${i}`,
        label: (s.l as string) || `镜头 ${i + 1}`,
        duration: (s.d as number) || 3,
        size: (s.sz as ShotSize) || "medium",
        move: (s.mv as CameraMove) || "static",
        subject: (s.su as string) || "",
        action: (s.ac as string) || "",
        environment: (s.en as string) || "",
        emotion: (s.em as string) || "",
        notes: s.nt as string | undefined,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

// ============================================================
// localStorage 项目历史
// ============================================================

const STORAGE_KEY = "yuntech-studio-projects-v1";

export function saveProject(project: StudioProject): void {
  if (typeof window === "undefined") return;
  try {
    const existing = loadProjects();
    const idx = existing.findIndex((p) => p.id === project.id);
    const updated = { ...project, updatedAt: new Date().toISOString() };
    if (idx >= 0) {
      existing[idx] = updated;
    } else {
      existing.unshift(updated);
    }
    // 最多保存30个
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 30)));
  } catch (e) {
    console.warn("保存失败", e);
  }
}

export function loadProjects(): StudioProject[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function deleteProject(id: string): void {
  if (typeof window === "undefined") return;
  const existing = loadProjects().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export const AI_PLATFORMS: { value: AIPlatform; label: string; flag: string }[] = [
  { value: "wan", label: "Wan 2.2", flag: "🇨🇳" },
  { value: "kling", label: "可灵 Kling", flag: "🇨🇳" },
  { value: "vidu", label: "Vidu", flag: "🇨🇳" },
  { value: "sora", label: "Sora", flag: "🇺🇸" },
  { value: "runway", label: "Runway Gen-3", flag: "🇺🇸" },
  { value: "pika", label: "Pika", flag: "🇺🇸" },
  { value: "luma", label: "Luma Dream", flag: "🇺🇸" },
];
