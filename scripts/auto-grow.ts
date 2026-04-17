#!/usr/bin/env node
/**
 * 自动增长引擎 · 让SEO内容帝国持续扩张
 *
 * 运行：npx tsx scripts/auto-grow.ts
 *
 * 功能：
 * 1. 基于已有20个精选案例，自动生成N个新案例变体
 * 2. 追加到 src/lib/showcases.ts 的 SHOWCASES 数组
 * 3. 自动 git commit + push，触发 Vercel 重新部署
 * 4. 每次运行 = SEO页面多N个 = 搜索引擎覆盖面扩大
 *
 * 推荐使用：Windows任务计划每周执行一次，每次10条
 * 一年后：20 + 52 × 10 = 540 个SEO页面
 */

import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const SHOWCASES_FILE = path.join(
  __dirname,
  "..",
  "src",
  "lib",
  "showcases.ts"
);

// 组合生产变体的字段库
const VARIANTS = {
  ecommerce: {
    products: [
      "高端红酒礼盒",
      "智能咖啡机",
      "复古唱片机",
      "定制香水",
      "手工皂礼品",
      "木制厨具",
      "陶瓷餐具",
      "健康零食礼盒",
    ],
  },
  realestate: {
    products: [
      "公寓楼王户型",
      "养老度假社区",
      "别墅区游泳池",
      "loft工业风公寓",
      "江景豪宅",
      "度假酒店式公寓",
      "花园洋房",
      "顶层复式",
    ],
  },
  food: {
    products: [
      "精致法餐厅",
      "日式居酒屋",
      "网红茶饮店",
      "本帮菜餐厅",
      "烧烤夜宵店",
      "甜品工坊",
      "私房菜定制",
      "素食餐厅",
    ],
  },
  beauty: {
    products: [
      "抗衰紧致面霜",
      "男士护肤套装",
      "纯植物精油",
      "定制香氛礼盒",
      "专业彩妆刷",
      "敏感肌精华",
      "头皮护理",
      "身体磨砂",
    ],
  },
  wedding: {
    products: [
      "海外沙滩婚礼",
      "中式汉婚仪式",
      "草坪浪漫婚礼",
      "教堂西式婚礼",
      "求婚策划服务",
      "订婚派对视频",
      "结婚十周年回忆",
      "蜜月旅拍",
    ],
  },
  tech: {
    products: [
      "AI语音助手",
      "无人机新品",
      "VR头显",
      "智能机器人",
      "区块链产品",
      "新能源电池",
      "折叠屏手机",
      "智能穿戴设备",
    ],
  },
};

const STYLES = [
  { key: "cinematic", label: "电影感" },
  { key: "minimalist", label: "极简" },
  { key: "warm", label: "温馨" },
  { key: "luxurious", label: "高级奢华" },
  { key: "fresh", label: "清新" },
];

const INDUSTRY_LABELS: Record<string, string> = {
  ecommerce: "电商产品",
  realestate: "房产楼盘",
  food: "餐饮美食",
  beauty: "美妆护肤",
  wedding: "婚礼浪漫",
  tech: "科技产品",
};

const COLORS: Record<string, string[]> = {
  ecommerce: ["from-amber-500/30 to-orange-600/30", "from-red-500/30 to-yellow-500/30"],
  realestate: ["from-blue-500/30 to-cyan-500/30", "from-emerald-500/30 to-teal-500/30"],
  food: ["from-red-500/30 to-amber-500/30", "from-orange-400/30 to-red-400/30"],
  beauty: ["from-pink-500/30 to-rose-500/30", "from-purple-400/30 to-pink-400/30"],
  wedding: ["from-rose-400/30 to-pink-500/30", "from-violet-400/30 to-fuchsia-400/30"],
  tech: ["from-indigo-500/30 to-purple-600/30", "from-cyan-500/30 to-blue-600/30"],
};

function slugify(s: string, industry: string) {
  const hash = Math.random().toString(36).slice(2, 8);
  return `${industry}-${s.toLowerCase().replace(/[^a-z0-9]/gi, "").slice(0, 10) || "item"}-${hash}`;
}

function generateCase(industry: string, product: string, style: typeof STYLES[0]) {
  const industryLabel = INDUSTRY_LABELS[industry];
  const colorArr = COLORS[industry] || COLORS.tech;
  const color = colorArr[Math.floor(Math.random() * colorArr.length)];
  const slug = slugify(product, industry);
  const duration = ["10秒", "15秒", "20秒"][Math.floor(Math.random() * 3)];
  const price = ["499元", "699元", "899元", "1299元"][Math.floor(Math.random() * 4)];

  return {
    slug,
    title: `${product}${industryLabel}AI宣传视频 | ${style.label}风格商用案例`,
    shortTitle: `${product}AI视频`,
    type: "video",
    industry,
    industryLabel,
    style: style.key,
    styleLabel: style.label,
    description: `为${product}品牌定制的${style.label}风格商业视频。运用AI生成技术，在${duration}内完整呈现产品价值与品牌调性，成本仅为传统制作的十分之一，交付周期压缩至24小时内。`,
    scenario: `${industryLabel}电商详情页、品牌宣传物料、社交媒体投放素材`,
    clientType: `${industryLabel}品牌方、中小商家、自媒体运营`,
    prompt: `${duration}${style.label}风格的${product}商业视频。镜头语言：产品360度环绕，浅景深，电影级色彩分级。光线：柔和顶光配合侧逆光。色彩：匹配品牌调性。场景：符合产品调性的场景布置。情绪：${style.label}氛围。节奏：契合主题的节奏控制。`,
    highlights: [
      "AI精准还原产品质感细节",
      "专业级光影与色彩调度",
      "品牌调性与视觉风格统一",
    ],
    deliverables: [
      `主视频 × 1条（${duration}）`,
      "9:16竖版社交媒体版",
      "静态高清截图 × 3张",
    ],
    duration,
    resolution: "1080P",
    processingTime: "12-24小时",
    price,
    color,
    publishedAt: new Date().toISOString().slice(0, 10),
    featured: false,
  };
}

function appendCasesToFile(cases: ReturnType<typeof generateCase>[]) {
  let content = fs.readFileSync(SHOWCASES_FILE, "utf-8");

  // 找到 SHOWCASES 数组的右括号，在它前面插入新条目
  const marker = "];";
  const lastMarkerIdx = content.lastIndexOf(
    "];",
    content.indexOf("// ============================================================\n// 查询工具函数")
  );

  if (lastMarkerIdx < 0) {
    throw new Error("找不到SHOWCASES数组结束标记，文件结构可能已变");
  }

  const insertion = cases
    .map((c) => {
      return `  ${JSON.stringify(c, null, 2).replace(/\n/g, "\n  ")},\n`;
    })
    .join("");

  content =
    content.slice(0, lastMarkerIdx) +
    insertion +
    content.slice(lastMarkerIdx);

  fs.writeFileSync(SHOWCASES_FILE, content, "utf-8");
}

// ============================================================
// 主流程
// ============================================================
function main() {
  const COUNT = Number(process.argv[2] || 10);
  console.log(`🌱 准备自动生成 ${COUNT} 个新案例...\n`);

  const cases = [];
  const industries = Object.keys(VARIANTS) as (keyof typeof VARIANTS)[];

  for (let i = 0; i < COUNT; i++) {
    const industry = industries[i % industries.length];
    const products = VARIANTS[industry].products;
    const product = products[Math.floor(Math.random() * products.length)];
    const style = STYLES[Math.floor(Math.random() * STYLES.length)];
    const c = generateCase(industry, product, style);
    cases.push(c);
    console.log(`  + ${c.slug}`);
  }

  appendCasesToFile(cases);
  console.log(`\n✓ ${COUNT} 条新案例已追加到 showcases.ts`);

  // 自动提交
  try {
    const cwd = path.join(__dirname, "..");
    execSync(`git add src/lib/showcases.ts`, { cwd });
    execSync(
      `git commit -m "content: 自动增长 +${COUNT} 个SEO案例 (${new Date().toISOString().slice(0, 10)})"`,
      { cwd }
    );
    console.log("✓ 已提交到本地仓库");

    // 尝试推送（如果git已配置远程）
    try {
      execSync("git push", { cwd, stdio: "pipe" });
      console.log("✓ 已推送到GitHub，Vercel将自动重新部署");
      console.log(
        "\n🎉 完成！几分钟后访问您的站点，会多出 " +
          COUNT +
          " 个新SEO页面"
      );
    } catch (err) {
      console.log("⚠️ 推送失败（可能需要手动push）");
    }
  } catch (err) {
    const e = err as Error;
    console.log("⚠️ Git操作失败：" + e.message);
    console.log("请手动 git add . && git commit && git push");
  }
}

main();
