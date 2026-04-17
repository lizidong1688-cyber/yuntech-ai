/**
 * AI视频提示词生成器核心逻辑
 *
 * 基于行业+风格+主题，生成3条专业级视频生成提示词
 * 未来可替换为大模型API驱动，当前使用高质量模板组合
 */

export type Industry =
  | "ecommerce"
  | "realestate"
  | "food"
  | "beauty"
  | "wedding"
  | "tech"
  | "education"
  | "fitness";

export type Style =
  | "cinematic"
  | "minimalist"
  | "warm"
  | "futuristic"
  | "luxurious"
  | "fresh"
  | "dynamic";

export type Duration = "short" | "medium" | "long";

export interface PromptRequest {
  industry: Industry;
  style: Style;
  theme: string;
  duration?: Duration;
}

export interface GeneratedPrompt {
  title: string;
  prompt: string;
  negative: string;
  tips: string[];
}

// ============================================================
// 行业视觉元素库 —— 每个行业的典型镜头、光线、构图
// ============================================================
const INDUSTRY_VISUALS: Record<
  Industry,
  { label: string; shots: string[]; lighting: string[]; elements: string[] }
> = {
  ecommerce: {
    label: "电商产品",
    shots: [
      "360度环绕展示",
      "产品细节特写微距镜头",
      "产品在使用场景中的动态展示",
      "从俯视到侧视的平滑过渡",
    ],
    lighting: [
      "柔和的演播室灯光配合反射板",
      "自然光从45度角照射突出质感",
      "戏剧性侧光展现产品轮廓",
    ],
    elements: [
      "干净的浅色背景",
      "带有轻微倒影的玻璃台面",
      "与产品色系呼应的点缀元素",
    ],
  },
  realestate: {
    label: "房产楼盘",
    shots: [
      "无人机从高空缓慢下降的开场",
      "穿过大堂进入样板间的连续运镜",
      "窗外城市景观与室内空间的呼应",
      "客厅到卧室的流畅漫游",
    ],
    lighting: [
      "金色黄昏时刻的暖光",
      "清晨第一缕阳光透过落地窗",
      "温馨的室内暖色灯光",
    ],
    elements: [
      "精致的家具陈设",
      "窗外的城市天际线",
      "绿植与艺术装饰",
    ],
  },
  food: {
    label: "餐饮美食",
    shots: [
      "食材从空中缓慢落入锅中的慢镜头",
      "热气腾腾的顶视图",
      "筷子/叉子夹起食物的特写",
      "油光闪烁的诱人细节",
    ],
    lighting: [
      "温暖的侧逆光突出食物质感",
      "餐厅氛围暖光配合烛光",
      "明亮的自然光从窗户进入",
    ],
    elements: [
      "原木餐桌或大理石台面",
      "新鲜食材作为点缀",
      "精致的餐具与餐布",
    ],
  },
  beauty: {
    label: "美妆护肤",
    shots: [
      "产品缓慢旋转的优雅展示",
      "滴液滑落的慢动作微距",
      "模特使用产品的柔焦特写",
      "产品与质地的同框对比",
    ],
    lighting: [
      "柔和的环形灯均匀打亮",
      "梦幻的粉色/金色调光",
      "高级感的顶光配合柔光箱",
    ],
    elements: [
      "大理石化妆台面",
      "花瓣或水珠的装饰",
      "镜面反射的优雅构图",
    ],
  },
  wedding: {
    label: "婚礼浪漫",
    shots: [
      "新人在花丛中缓慢行走",
      "交换戒指的特写慢镜头",
      "无人机航拍婚礼现场全景",
      "宾客鼓掌的温馨瞬间",
    ],
    lighting: [
      "黄昏金色时刻的魔法光线",
      "烛光与串灯交织的温馨氛围",
      "柔和的晨光透过婚纱",
    ],
    elements: [
      "白色花艺装饰",
      "飘逸的婚纱与西装",
      "飞舞的花瓣与丝带",
    ],
  },
  tech: {
    label: "科技产品",
    shots: [
      "产品从数字化粒子中浮现",
      "内部结构的分解展示",
      "UI界面在屏幕上流畅切换",
      "产品在未来感空间中的展示",
    ],
    lighting: [
      "冷蓝色基调配合霓虹点缀",
      "高对比度的硬光雕刻轮廓",
      "全息投影般的发光效果",
    ],
    elements: [
      "几何线条与网格背景",
      "悬浮的全息UI元素",
      "金属与玻璃质感材质",
    ],
  },
  education: {
    label: "教育培训",
    shots: [
      "学生专注学习的温暖特写",
      "老师讲解的动感镜头",
      "翻书与笔记的细节",
      "教室环境的全景展示",
    ],
    lighting: [
      "明亮的自然光营造活力感",
      "柔和的室内光展现专注氛围",
      "晨光透过窗户的励志质感",
    ],
    elements: [
      "整洁的书桌与文具",
      "黑板或电子屏幕展示",
      "温馨的校园环境",
    ],
  },
  fitness: {
    label: "健身运动",
    shots: [
      "运动员起跑瞬间的慢动作",
      "汗水飞溅的超高速特写",
      "器械训练的动感中景",
      "成功完成动作的庆祝镜头",
    ],
    lighting: [
      "戏剧性的侧逆光勾勒肌肉线条",
      "健身房工业风的顶光",
      "户外晨跑的金色阳光",
    ],
    elements: [
      "健身器械与场馆环境",
      "运动装备的动感展示",
      "汗水与水雾的视觉冲击",
    ],
  },
};

// ============================================================
// 风格调性库 —— 镜头语言、色彩、情绪、节奏
// ============================================================
const STYLE_LANGUAGE: Record<
  Style,
  { label: string; camera: string; color: string; mood: string; pacing: string }
> = {
  cinematic: {
    label: "电影感",
    camera: "浅景深，电影级色彩分级，2.39:1宽银幕构图",
    color: "青橙对比色调，阴影部分偏青，高光偏暖橙",
    mood: "庄重、有故事感、令人沉浸",
    pacing: "缓慢推进，富有张力的节奏",
  },
  minimalist: {
    label: "极简",
    camera: "对称构图，大量留白，固定或微动镜头",
    color: "单一主色配合黑白灰，低饱和度",
    mood: "纯净、高级、克制",
    pacing: "缓慢、呼吸感强",
  },
  warm: {
    label: "温馨",
    camera: "中近景为主，柔焦虚化，手持微动感",
    color: "奶茶色、米白、淡金等暖色系",
    mood: "亲切、温暖、治愈",
    pacing: "舒缓、自然流淌",
  },
  futuristic: {
    label: "未来科技",
    camera: "大胆运镜，粒子特效，HUD元素叠加",
    color: "冷蓝紫色基调，霓虹粉/青点缀",
    mood: "前沿、酷炫、充满想象",
    pacing: "快速切换，动感强烈",
  },
  luxurious: {
    label: "高级奢华",
    camera: "慢镜头为主，精致的微距细节",
    color: "深黑金色调，高饱和度，强对比",
    mood: "尊贵、精致、令人向往",
    pacing: "优雅从容，富有仪式感",
  },
  fresh: {
    label: "清新",
    camera: "明亮通透，自然光主导，简洁构图",
    color: "薄荷绿、天空蓝、暖黄等明快色",
    mood: "活力、年轻、愉悦",
    pacing: "轻快、节奏明快",
  },
  dynamic: {
    label: "动感潮流",
    camera: "快速切换，穿越运镜，GoPro视角",
    color: "高饱和度撞色，强烈对比",
    mood: "热血、张扬、引爆注意力",
    pacing: "急促、节奏鲜明，配合节拍",
  },
};

const DURATION_LABEL: Record<Duration, string> = {
  short: "6-10秒 短视频",
  medium: "15-30秒 标准广告",
  long: "45-60秒 故事叙事",
};

// ============================================================
// 通用负向提示词（避免AI生成常见问题）
// ============================================================
const COMMON_NEGATIVE =
  "模糊，畸变，低质量，水印，文字，logo错误，多余肢体，不合理的物理效果，闪烁，卡顿";

// ============================================================
// 核心生成函数
// ============================================================
export function generatePrompts(req: PromptRequest): GeneratedPrompt[] {
  const industry = INDUSTRY_VISUALS[req.industry];
  const style = STYLE_LANGUAGE[req.style];
  const durationText = req.duration ? DURATION_LABEL[req.duration] : "";

  // 生成3条不同角度的提示词（开篇、主体、特写）
  return [
    {
      title: "方案一：场景代入型",
      prompt: [
        `${durationText}${durationText ? "，" : ""}${style.label}风格的${req.theme}视频`,
        `镜头语言：${industry.shots[0]}，${style.camera}`,
        `光线：${industry.lighting[0]}`,
        `色彩：${style.color}`,
        `场景元素：${industry.elements[0]}，${industry.elements[1] || ""}`,
        `情绪基调：${style.mood}`,
        `节奏：${style.pacing}`,
      ]
        .filter(Boolean)
        .join("。"),
      negative: COMMON_NEGATIVE,
      tips: [
        "适合作为视频的开场镜头，快速建立氛围",
        "建议配合环境音或悠扬音乐",
        "重点是让观众沉浸进入这个世界",
      ],
    },
    {
      title: "方案二：产品聚焦型",
      prompt: [
        `${style.label}风格的${req.theme}产品展示视频`,
        `镜头语言：${industry.shots[1] || industry.shots[0]}，重点突出产品本身`,
        `光线：${industry.lighting[1] || industry.lighting[0]}`,
        `色彩：${style.color}`,
        `场景元素：${industry.elements[1] || industry.elements[0]}`,
        `情绪基调：专注、突出，${style.mood}`,
        `节奏：${style.pacing}，在关键细节处适当放慢`,
      ]
        .filter(Boolean)
        .join("。"),
      negative: COMMON_NEGATIVE,
      tips: [
        "核心转化镜头，让产品成为绝对主角",
        "建议搭配清晰的产品卖点字幕或画外音",
        "适合作为视频的主体段落",
      ],
    },
    {
      title: "方案三：情感共鸣型",
      prompt: [
        `${style.label}风格的${req.theme}情感故事视频`,
        `镜头语言：${industry.shots[2] || industry.shots[0]}，捕捉细腻瞬间`,
        `光线：${industry.lighting[2] || industry.lighting[0]}`,
        `色彩：${style.color}，强化情绪表达`,
        `场景元素：${industry.elements[2] || industry.elements[0]}`,
        `情绪基调：${style.mood}，唤起观众共鸣`,
        `节奏：${style.pacing}，在高潮处给予停留`,
      ]
        .filter(Boolean)
        .join("。"),
      negative: COMMON_NEGATIVE,
      tips: [
        "用于引发情感共鸣的结尾或高潮段落",
        "建议配合富有感染力的背景音乐",
        "让观众记住的不是产品，而是感受",
      ],
    },
  ];
}

// ============================================================
// 选项列表供UI使用
// ============================================================
export const INDUSTRY_OPTIONS: { value: Industry; label: string }[] = (
  Object.keys(INDUSTRY_VISUALS) as Industry[]
).map((k) => ({ value: k, label: INDUSTRY_VISUALS[k].label }));

export const STYLE_OPTIONS: { value: Style; label: string }[] = (
  Object.keys(STYLE_LANGUAGE) as Style[]
).map((k) => ({ value: k, label: STYLE_LANGUAGE[k].label }));

export const DURATION_OPTIONS: { value: Duration; label: string }[] = [
  { value: "short", label: "6-10秒" },
  { value: "medium", label: "15-30秒" },
  { value: "long", label: "45-60秒" },
];
