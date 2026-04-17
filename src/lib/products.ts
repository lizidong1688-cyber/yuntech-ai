/**
 * 数字商品中心
 *
 * 商品定义 + 购买流程 + 订单状态
 * 所有支付通过「个人收款码」完成（零商户认证门槛，0资金可启动）
 */

export type ProductTier = "hook" | "standard" | "pro";

export interface Product {
  slug: string;
  name: string;
  shortName: string;
  tier: ProductTier;
  priceYuan: number;
  originalPriceYuan?: number; // 划线价
  tagline: string; // 一句话卖点
  description: string; // 详细介绍（含关键词）
  features: string[]; // 核心功能列表
  targetAudience: string; // 目标用户
  includes: string[]; // 包含内容
  filePath: string; // 在repo中的相对路径（products/目录下）
  fileSize: string; // 文件大小描述
  fileFormat: string; // 格式说明
  color: string; // 渐变配色
  highlight?: boolean;
  badge?: string; // 徽章文字
}

export const PRODUCTS: Product[] = [
  {
    slug: "prompts-standard",
    name: "AI商业视频提示词宝典 · 标准版",
    shortName: "标准版",
    tier: "standard",
    priceYuan: 29.9,
    originalPriceYuan: 99,
    tagline: "3072条商业级AI视频提示词，16行业×12风格全覆盖",
    description:
      "这是一份由AI提示词工程师团队整理的商业级数据库，3072条提示词覆盖电商、房产、餐饮、美妆、婚礼、科技、教育、健身、汽车、旅游、母婴、宠物、金融、医疗、服装、游戏共16大行业。每条提示词都经过实际商业项目验证，开箱即用。",
    features: [
      "3072条独立商业级提示词",
      "16大商业行业深度覆盖",
      "8种主流视觉风格系统化分类",
      "每行业 192 条保证深度",
      "含完整负向提示词（避免AI常见缺陷）",
      "标注目标人群、转化建议、传统制作成本对比",
      "JSON + CSV + Markdown 三种格式",
      "永久更新，后续新增免费推送",
    ],
    targetAudience: "电商卖家、MCN机构、短视频运营、AI工作室、知识付费创作者",
    includes: [
      "prompts.json - 结构化数据（程序员友好）",
      "prompts.csv - Excel可直接筛选（UTF-8 BOM）",
      "prompts.md - 精美阅读版（手机电脑通用）",
      "新手必读.md - 3步快速上手指南",
      "授权说明.md - 商业使用授权条款",
    ],
    filePath: "products/standard-v1.zip",
    fileSize: "180 KB",
    fileFormat: "ZIP（内含JSON/CSV/MD三种文件）",
    color: "from-indigo-500/30 to-purple-600/30",
    highlight: true,
    badge: "🔥 最热销",
  },
  {
    slug: "prompts-pro",
    name: "AI商业视频提示词宝典 · Pro版",
    shortName: "Pro版",
    tier: "pro",
    priceYuan: 99,
    originalPriceYuan: 299,
    tagline: "标准版全部内容 + ComfyUI批量工作流 + 1v1远程指导",
    description:
      "在标准版全部3072条提示词的基础上，额外赠送可批量运行的ComfyUI工作流JSON（支持CSV批量读取+自动命名+视频插帧），以及30分钟1v1微信远程指导。这是Pro创作者的完整工具包。",
    features: [
      "包含标准版全部3072条提示词",
      "ComfyUI批量视频生成工作流（核心利器）",
      "客户交付工作流（单订单生成3个变体供客户挑选）",
      "日更内容工作流（定时自动生成社交媒体素材）",
      "30分钟1v1微信远程指导",
      "终身免费更新",
      "专属售后（24小时内响应）",
      "优先获得新增案例",
    ],
    targetAudience: "AI视频工作室、专业创作者、企业内容团队",
    includes: [
      "全部标准版内容",
      "2_ComfyUI工作流/ - 3套工作流JSON",
      "3_Pro版专属/ - 远程指导对接信息",
      "性能参数对照表（16GB/32GB/64GB/128GB不同配置推荐参数）",
    ],
    filePath: "products/pro-v1.zip",
    fileSize: "190 KB",
    fileFormat: "ZIP（含工作流+数据+文档）",
    color: "from-amber-500/30 to-orange-600/30",
    highlight: true,
    badge: "💎 高性价比",
  },
  {
    slug: "prompts-ecommerce",
    name: "AI电商产品视频提示词包",
    shortName: "电商行业版",
    tier: "hook",
    priceYuan: 19.9,
    originalPriceYuan: 49,
    tagline: "专为电商详情页优化的192条AI视频提示词",
    description:
      "针对天猫、京东、拼多多、抖音小店等电商平台的商品视频场景专门优化。覆盖服饰、美妆、数码、家居、食品等主流电商类目，适配主图视频、详情页视频、短视频种草等投放形态。",
    features: [
      "192条电商场景提示词",
      "适配天猫/京东/抖音/拼多多",
      "包含产品展示、使用场景、对比演示三种镜头",
      "含目标人群与转化建议",
      "10秒与15秒双时长版本",
    ],
    targetAudience: "淘宝天猫卖家、独立站运营、电商美工",
    includes: ["电商产品_提示词.json", "电商产品_提示词.csv", "升级到完整版.md"],
    filePath: "products/industry-ecommerce-v1.zip",
    fileSize: "13 KB",
    fileFormat: "ZIP（JSON+CSV）",
    color: "from-blue-500/30 to-cyan-500/30",
  },
  {
    slug: "prompts-realestate",
    name: "AI房产楼盘宣传视频提示词包",
    shortName: "房产行业版",
    tier: "hook",
    priceYuan: 19.9,
    originalPriceYuan: 49,
    tagline: "海景别墅到样板间全场景192条AI宣传视频提示词",
    description:
      "房产楼盘营销专用提示词集，包含海景别墅、改善型三居、商业综合体、学区房等场景。每条都针对房产客户决策心理优化，从航拍开场到样板间漫游全流程覆盖。",
    features: [
      "192条房产场景提示词",
      "覆盖别墅/公寓/商业/写字楼",
      "含航拍、室内漫游、窗景定格等运镜",
      "适配中介朋友圈、楼盘官网、招商路演",
      "含客户决策心理转化建议",
    ],
    targetAudience: "房产中介、楼盘销售、地产自媒体",
    includes: ["房产楼盘_提示词.json", "房产楼盘_提示词.csv", "升级到完整版.md"],
    filePath: "products/industry-realestate-v1.zip",
    fileSize: "13 KB",
    fileFormat: "ZIP（JSON+CSV）",
    color: "from-emerald-500/30 to-teal-500/30",
  },
  {
    slug: "prompts-food",
    name: "AI餐饮美食视频提示词包",
    shortName: "餐饮行业版",
    tier: "hook",
    priceYuan: 19.9,
    originalPriceYuan: 49,
    tagline: "火锅到下午茶192条让人饿的AI美食视频提示词",
    description:
      "餐饮行业专用，从街边麻辣到精致下午茶全类目覆盖。热气腾腾的食材落锅、筷子夹起食物的特写、油光闪烁的诱人细节——让每一帧都勾起食欲。",
    features: [
      "192条餐饮场景提示词",
      "覆盖火锅/快餐/日料/咖啡/甜品",
      "强调食欲诱惑视觉效果",
      "适配美团/抖音同城/大众点评",
      "含到店转化话术建议",
    ],
    targetAudience: "餐厅老板、美食博主、外卖运营",
    includes: ["餐饮美食_提示词.json", "餐饮美食_提示词.csv", "升级到完整版.md"],
    filePath: "products/industry-food-v1.zip",
    fileSize: "13 KB",
    fileFormat: "ZIP（JSON+CSV）",
    color: "from-red-500/30 to-orange-500/30",
  },
  {
    slug: "prompts-beauty",
    name: "AI美妆护肤视频提示词包",
    shortName: "美妆行业版",
    tier: "hook",
    priceYuan: 19.9,
    originalPriceYuan: 49,
    tagline: "口红到面膜192条高级感美妆广告AI视频提示词",
    description:
      "美妆行业专用提示词包，口红、粉底液、精华、面膜、眼影全覆盖。梦幻柔光+大理石化妆台+微距膏体质地——打造小红书爆款级的视觉质感。",
    features: [
      "192条美妆场景提示词",
      "覆盖口红/粉底/精华/面膜/眼影",
      "高级奢华与清新梦幻双风格",
      "适配小红书/天猫美妆/抖音信息流",
      "含新品种草转化建议",
    ],
    targetAudience: "美妆品牌、美妆博主、美妆电商",
    includes: ["美妆护肤_提示词.json", "美妆护肤_提示词.csv", "升级到完整版.md"],
    filePath: "products/industry-beauty-v1.zip",
    fileSize: "13 KB",
    fileFormat: "ZIP（JSON+CSV）",
    color: "from-pink-500/30 to-rose-500/30",
  },
];

// ============================================================
// 查询工具
// ============================================================

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getHighlightedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.highlight);
}

export function getIndustryProducts(): Product[] {
  return PRODUCTS.filter((p) => p.tier === "hook");
}

// ============================================================
// 订单与下载Token
// ============================================================

export interface Order {
  id: string;
  productSlug: string;
  productName: string;
  priceYuan: number;
  buyerPhone?: string;
  buyerWechat?: string;
  paymentMethod: "alipay" | "wechat";
  paymentRef?: string; // 支付订单号/截图说明
  note?: string;
  status: "pending" | "confirmed" | "delivered" | "refunded";
  downloadToken?: string;
  downloadExpiresAt?: string;
  createdAt: string;
  confirmedAt?: string;
  deliveredAt?: string;
  ip?: string;
}
