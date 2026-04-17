/**
 * AI漫剧作品集 —— 真实AI生成作品
 *
 * 这不是模板，也不是概念设计——
 * 这是云创未来用本地AI工作站（Flux + Wan 2.2）实际生产交付的作品
 */

export interface Scene {
  id: string; // scene-XX
  image: string; // /portfolio/manhua-chenan/scene-XX.png
  video?: string; // /portfolio/videos/scene-XX.webm（如有）
  title: string;
  description: string;
  mood: string; // 情绪标签
}

export interface ManhuaCase {
  slug: string;
  title: string;
  shortTitle: string;
  theme: string; // 题材
  style: string; // 风格
  characterSheet: string;
  scenes: Scene[];
  stats: {
    sceneCount: number;
    videoCount: number;
    productionDays: number;
    traditionalCost: string; // 传统制作对比成本
    aiCost: string;
  };
}

export const CHENAN_MANHUA: ManhuaCase = {
  slug: "chenan-legend",
  title: "《尘安传》国风玄幻漫剧首章",
  shortTitle: "尘安传",
  theme: "国风玄幻 / 仙侠",
  style: "国潮漫画风 + 电影级光影",
  characterSheet: "/portfolio/manhua-chenan/00-character.png",
  scenes: [
    {
      id: "scene-01",
      image: "/portfolio/manhua-chenan/scene-01.png",
      title: "红光初现",
      description: "少年侧颜特写，发丝随风飘动，眼神坚毅",
      mood: "肃穆 · 命运",
    },
    {
      id: "scene-02",
      image: "/portfolio/manhua-chenan/scene-02.png",
      title: "长门殿前",
      description: "身着白衣的少女伫立宫殿红毯尽头，宫人两侧列阵",
      mood: "庄严 · 仪式感",
    },
    {
      id: "scene-03",
      image: "/portfolio/manhua-chenan/scene-03.png",
      video: "/portfolio/videos/scene-03.webm",
      title: "仙山云海",
      description: "动态视频：主角乘风穿云，背景是绵延仙山",
      mood: "壮阔 · 自由",
    },
    {
      id: "scene-04",
      image: "/portfolio/manhua-chenan/scene-04.png",
      video: "/portfolio/videos/scene-04.webm",
      title: "功法初成",
      description: "动态视频：少年在林间修炼，灵力环绕周身",
      mood: "专注 · 成长",
    },
    {
      id: "scene-05",
      image: "/portfolio/manhua-chenan/scene-05.png",
      title: "山门登顶",
      description: "少年逆光登顶，远处群山与云雾交织",
      mood: "孤勇 · 追寻",
    },
    {
      id: "scene-06",
      image: "/portfolio/manhua-chenan/scene-06.png",
      title: "师门初遇",
      description: "与道长初次相见，山雾缭绕的青石小径",
      mood: "机缘 · 转折",
    },
    {
      id: "scene-07",
      image: "/portfolio/manhua-chenan/scene-07.png",
      title: "老者传道",
      description: "白发道长抚须凝视，目光深邃如千年古井",
      mood: "沉静 · 智慧",
    },
    {
      id: "scene-08",
      image: "/portfolio/manhua-chenan/scene-08.png",
      title: "危机暗涌",
      description: "暗色调场景，前方乌云翻滚，主角直面困境",
      mood: "紧张 · 危机",
    },
    {
      id: "scene-09",
      image: "/portfolio/manhua-chenan/scene-09.png",
      title: "灵力觉醒",
      description: "主角周身金光流转，背景是破碎的虚空",
      mood: "突破 · 觉醒",
    },
    {
      id: "scene-10",
      image: "/portfolio/manhua-chenan/scene-10.png",
      title: "夕阳相依",
      description: "年轻女子与白发长者温柔相拥，夕阳金色光辉映照",
      mood: "温情 · 羁绊",
    },
    {
      id: "scene-11",
      image: "/portfolio/manhua-chenan/scene-11.png",
      title: "离别之夜",
      description: "月色下的独白，长发少女背影望向远山",
      mood: "惆怅 · 告别",
    },
    {
      id: "scene-12",
      image: "/portfolio/manhua-chenan/scene-12.png",
      video: "/portfolio/videos/scene-12.webm",
      title: "长剑出鞘",
      description: "动态视频：少年剑气纵横，斩破虚空",
      mood: "锋芒 · 决意",
    },
    {
      id: "scene-13",
      image: "/portfolio/manhua-chenan/scene-13.png",
      title: "天命启程",
      description: "回望故乡的最后一眼，脚下是新的道路",
      mood: "决绝 · 成长",
    },
    {
      id: "scene-14",
      image: "/portfolio/manhua-chenan/scene-14.png",
      video: "/portfolio/videos/scene-14.webm",
      title: "天雷降临",
      description: "动态视频：乌云翻滚红雷轰鸣，主角从容直立",
      mood: "宿命 · 觉醒",
    },
  ],
  stats: {
    sceneCount: 14,
    videoCount: 4,
    productionDays: 3,
    traditionalCost: "50,000-150,000元（传统漫画工作室）",
    aiCost: "约 150元（电费 + 存储，一人3天完成）",
  },
};

export function getManhuaCases(): ManhuaCase[] {
  return [CHENAN_MANHUA];
}

export function getManhuaCase(slug: string): ManhuaCase | undefined {
  return getManhuaCases().find((c) => c.slug === slug);
}
