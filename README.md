# 云创未来 · AI视频与图像生成服务

> 海口云创未来科技有限公司官方业务平台
> 基于 Next.js 16 + React 19 + Tailwind CSS 4 构建

## 这是什么

一个**面向商业转化**的完整AI内容生产服务平台，具备：

- **品牌官网** — 服务介绍、价格方案、案例展示
- **AI提示词生成器** — 访客免费工具，同时作为线索捕获漏斗
- **20+行业案例库** — 每个案例独立SEO页面 + 动态OG图 + JSON-LD结构化数据
- **线索管理后台** — 自建微型CRM，Bearer Token鉴权
- **完整SEO基建** — sitemap自动生成、robots、品牌icon、元数据

## 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 复制环境变量
cp .env.example .env.local
# 按需修改 .env.local 中的配置

# 启动开发服务器
npm run dev
# 访问 http://localhost:3000
```

### 生产构建

```bash
npm run build
npm start
```

## 核心目录结构

```
src/
├── app/
│   ├── page.tsx                    # 首页
│   ├── layout.tsx                  # 全局布局
│   ├── globals.css                 # 全局样式
│   ├── sitemap.ts                  # 自动生成sitemap
│   ├── robots.ts                   # 爬虫规则
│   ├── icon.svg                    # 品牌图标
│   ├── showcases/page.tsx          # 案例库索引页
│   ├── showcase/[slug]/
│   │   ├── page.tsx                # 案例详情页
│   │   └── opengraph-image.tsx     # 案例OG图动态生成
│   ├── admin/leads/page.tsx        # 线索管理后台
│   └── api/
│       ├── lead/route.ts           # 接收线索提交
│       └── admin/leads/route.ts    # 后台数据接口
├── components/                     # 页面区块组件
│   ├── Navbar.tsx Hero.tsx Services.tsx
│   ├── PromptGenerator.tsx         # AI提示词生成器
│   ├── Portfolio.tsx Pricing.tsx About.tsx
│   ├── Contact.tsx Footer.tsx
└── lib/
    ├── showcases.ts                # 案例库数据源
    ├── promptGenerator.ts          # 提示词生成逻辑
    └── leadStorage.ts              # 线索存储层
```

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `NEXT_PUBLIC_SITE_URL` | 公开站点URL，用于SEO | `https://yunchuangweilai.com` |
| `ADMIN_TOKEN` | 管理后台访问令牌 | `yuntech-admin-2026` |

**⚠️ 生产环境必改：** `ADMIN_TOKEN` 务必改为强密码。

## 部署到Vercel（推荐）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 首次部署（跟随提示）
vercel

# 在Vercel控制台设置环境变量：
#   NEXT_PUBLIC_SITE_URL = https://你的域名
#   ADMIN_TOKEN = 你的强密码

# 生产部署
vercel --prod
```

## 线索数据持久化

当前实现为文件型JSON存储（`.data/leads.json`），适合MVP阶段（前几百条）。

**⚠️ Vercel部署限制：** Vercel函数文件系统是只读的，生产环境需升级为：

- **Vercel KV**（Redis）— 推荐，集成最丝滑
- **Vercel Postgres** — 需要更强查询能力时
- **外部数据库**（Supabase/PlanetScale等）

替换方式：实现 `src/lib/leadStorage.ts` 同样的接口即可，上层代码无感。

## 管理后台使用

1. 访问 `/admin/leads`
2. 输入 `ADMIN_TOKEN`（默认：`yuntech-admin-2026`）
3. 查看所有线索，支持：
   - 按来源/状态筛选
   - 标记状态（待联系/已联系/已成交/放弃）
   - 数据统计卡片（累计、今日、各状态分布）

## 添加新案例到案例库

编辑 `src/lib/showcases.ts`，在 `SHOWCASES` 数组追加一条：

```ts
{
  slug: "your-unique-slug",           // URL路径
  title: "SEO标题（含关键词）",
  shortTitle: "卡片简短标题",
  type: "video",
  industry: "ecommerce",
  industryLabel: "电商产品",
  style: "cinematic",
  styleLabel: "电影感",
  description: "富含关键词的案例描述...",
  scenario: "适用场景",
  clientType: "目标客户画像",
  prompt: "实际使用的AI提示词",
  highlights: ["亮点1", "亮点2", "亮点3"],
  deliverables: ["交付物1", "交付物2"],
  duration: "15秒",
  resolution: "1080P",
  processingTime: "12小时",
  price: "899元",
  color: "from-amber-500/30 to-orange-600/30",
  publishedAt: "2026-04-17",
  featured: false,
}
```

保存后：
- 自动出现在 `/showcases` 列表
- 自动生成 `/showcase/your-unique-slug` SEO页
- 自动生成 OG图
- 自动写入 `sitemap.xml`

## 技术栈

- **框架：** Next.js 16.2.4（App Router + Turbopack）
- **UI：** React 19 + Tailwind CSS 4
- **语言：** TypeScript 5
- **字体：** Geist Sans / Mono（Vercel）
- **部署：** Vercel（推荐）/ 任何支持Node.js的主机

## 许可

专有软件，版权所有 © 2026 海口云创未来科技有限公司
