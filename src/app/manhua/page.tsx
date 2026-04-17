import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CHENAN_MANHUA } from "@/lib/manhuaCases";

export const metadata: Metadata = {
  title: "AI漫剧定制服务 | 国风玄幻AI漫画创作 | 云创未来",
  description:
    "国风玄幻AI漫剧实际作品案例展示。Flux + Wan 2.2驱动，14场景+4段动态视频，3天交付，成本仅为传统制作的1%。¥1999起定制您的专属IP漫剧。",
  keywords: [
    "AI漫画",
    "AI漫剧",
    "国风漫画",
    "玄幻漫画",
    "AI动漫",
    "AI角色设计",
    "漫画定制",
    "IP形象设计",
    "Flux漫画",
    "Wan 2.2视频",
  ],
  openGraph: {
    title: "AI漫剧定制 | 真实作品展示",
    description:
      "14场景+4段视频的完整国风玄幻AI漫剧——这是我们在3天内用本地AI工作站实际产出的作品",
    type: "website",
    locale: "zh_CN",
    images: [
      {
        url: "/portfolio/manhua-chenan/scene-14.png",
        width: 1024,
        height: 1024,
      },
    ],
  },
};

export default function ManhuaPage() {
  const c = CHENAN_MANHUA;

  // JSON-LD 结构化数据 - CreativeWork + Service
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI漫剧定制服务",
    description:
      "国风玄幻AI漫剧定制，基于Flux + Wan 2.2，3-7天交付完整章节",
    provider: {
      "@type": "Organization",
      name: "海口云创未来科技有限公司",
    },
    offers: {
      "@type": "Offer",
      price: 1999,
      priceCurrency: "CNY",
      availability: "https://schema.org/InStock",
    },
    areaServed: "CN",
    serviceType: "AI漫画制作",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="pt-24 pb-24 min-h-screen">
        {/* Hero: 作品英雄区 */}
        <section className="relative overflow-hidden mb-16">
          <div className="absolute inset-0 -z-10">
            <Image
              src="/portfolio/manhua-chenan/scene-14.png"
              alt=""
              fill
              className="object-cover blur-3xl opacity-20"
              priority
            />
          </div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-sm text-accent-light mb-6">
              🎨 真实作品 · 并非模板
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-accent-light to-purple-400 bg-clip-text text-transparent">
              AI漫剧定制服务
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-4">
              14场景 + 4段动态视频 + 角色设定 = <strong className="text-white">完整一章国风漫剧</strong>
            </p>
            <p className="text-gray-400 max-w-xl mx-auto">
              以下展示的不是概念稿，不是素材库——
              <br />
              是我们用本地AI工作站在3天内<strong className="text-white">实际产出</strong>的作品
            </p>
          </div>
        </section>

        {/* 数据对比 */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: c.stats.sceneCount.toString(), label: "完整场景" },
              { value: c.stats.videoCount.toString(), label: "动态视频片段" },
              { value: `${c.stats.productionDays}天`, label: "实际交付周期" },
              { value: "99%↓", label: "vs传统制作成本" },
            ].map((s) => (
              <div
                key={s.label}
                className="p-5 rounded-xl bg-surface border border-border/50 text-center"
              >
                <div className="text-3xl font-bold text-accent-light mb-1">
                  {s.value}
                </div>
                <div className="text-sm text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-5 rounded-xl bg-gradient-to-r from-red-500/10 to-accent/10 border border-red-500/30">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-400 mb-1">传统漫画工作室</div>
                <div className="text-xl font-bold text-red-300">
                  {c.stats.traditionalCost}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  需3-6个月，5-10人团队
                </div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">云创未来AI工作站</div>
                <div className="text-xl font-bold text-green-300">
                  {c.stats.aiCost}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  3-7天交付，一人即可完成
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 角色设定 */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="text-center mb-8">
            <span className="text-accent-light text-sm font-medium tracking-wider uppercase">
              角色设定 · Character Sheet
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3">
              主角：尘安
            </h2>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto">
              先完成角色基础设定，确保14场景中容貌一致——这是AI漫画最难的部分，而我们已经解决
            </p>
          </div>
          <div className="flex justify-center">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-2xl overflow-hidden border border-border/50">
              <Image
                src={c.characterSheet}
                alt="尘安 - 角色设定"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 288px, 384px"
              />
            </div>
          </div>
        </section>

        {/* 14场景展示 */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="text-center mb-10">
            <span className="text-accent-light text-sm font-medium tracking-wider uppercase">
              完整14场景 · Full Storyline
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3">
              《尘安传》首章
            </h2>
            <p className="text-gray-400 mt-3">
              每一张都是Flux本地生成 · 动态视频部分由Wan 2.2驱动
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {c.scenes.map((scene, idx) => (
              <figure
                key={scene.id}
                className="group rounded-2xl overflow-hidden border border-border/50 hover:border-accent/40 transition-all duration-300 bg-surface"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  {scene.video ? (
                    <video
                      src={scene.video}
                      poster={scene.image}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <Image
                      src={scene.image}
                      alt={scene.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/60 backdrop-blur text-white text-xs">
                    场景 {String(idx + 1).padStart(2, "0")}
                  </div>
                  {scene.video && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-accent/80 backdrop-blur text-white text-xs font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      动态视频
                    </div>
                  )}
                </div>
                <figcaption className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white">{scene.title}</h3>
                    <span className="text-xs text-accent-light">
                      {scene.mood}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {scene.description}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* 定价 */}
        <section
          id="pricing"
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16"
        >
          <div className="text-center mb-10">
            <span className="text-accent-light text-sm font-medium tracking-wider uppercase">
              价格方案 · Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3">
              为您定制专属漫剧
            </h2>
            <p className="text-gray-400 mt-3">
              透明定价 · 首次合作可免费出1张角色设定样图
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <PricingCard
              name="角色设定"
              price="299"
              unit="/个角色"
              features={[
                "1张完整角色设定图",
                "多角度参考（正面+侧面）",
                "PuLID人脸一致性保持",
                "商用授权",
                "3-5次免费修改",
              ]}
              deliveryTime="24小时"
            />
            <PricingCard
              name="漫剧首章"
              price="1999"
              unit="/章"
              features={[
                "1个主角完整设定",
                "10-15个故事场景",
                "1-2段动态视频片段",
                "PSD源文件+高清PNG",
                "7-10天交付",
                "2次大幅修改+无限次微调",
              ]}
              deliveryTime="7-10天"
              highlight
              badge="最受欢迎"
            />
            <PricingCard
              name="品牌IP包"
              price="4999"
              unit="起"
              features={[
                "专属品牌角色IP设计",
                "20+场景完整世界观",
                "5+段动态视频",
                "社交媒体素材全套",
                "品牌运营指导",
                "专属服务档期",
              ]}
              deliveryTime="15-20天"
            />
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-semibold text-lg transition-all shadow-lg"
            >
              联系定制 · 免费出样图
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">常见问题</h2>
          <div className="space-y-3">
            {[
              {
                q: "为什么AI漫画能做到人物一致？传统AI不是每张脸都不一样吗？",
                a: "我们使用PuLID + IP-Adapter + 定制LoRA的组合方案，可以让同一角色在几十个场景中保持统一外观——包括面部特征、发型、服装。这是专业AI漫画区别于普通文生图的核心技术。",
              },
              {
                q: "可以做真人IP或我的自画像吗？",
                a: "可以。提供3-5张参考照片，我们会训练专属LoRA模型（训练费包含在套餐价中），之后所有场景都会保持您的真实面部特征。",
              },
              {
                q: "版权归属如何？",
                a: "交付作品版权完全归客户所有，您拥有商用、出版、改编等所有权利。我们保留使用项目作为作品集展示的权利（可协商匿名处理）。",
              },
              {
                q: "动态视频是如何制作的？",
                a: "我们使用Wan 2.2 I2V模型，将静态场景图作为首帧，AI生成后续帧，形成5-8秒的连贯动态视频。适用于品牌宣传、视频号封面、抖音前3秒高光。",
              },
              {
                q: "能否按我的剧本/世界观定制？",
                a: "完全可以。只需提供剧本大纲或场景清单，我们会逐帧设计构图、光线、情绪——这是漫剧首章套餐的核心价值。",
              },
            ].map((item, i) => (
              <details
                key={i}
                className="group p-5 rounded-xl bg-surface border border-border/50 hover:border-accent/30 transition-colors"
              >
                <summary className="cursor-pointer font-medium list-none flex items-start justify-between gap-4">
                  <span>{item.q}</span>
                  <svg
                    className="w-5 h-5 text-gray-500 shrink-0 mt-1 group-open:rotate-180 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <p className="mt-4 text-sm text-gray-400 leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* 最终CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-10 rounded-2xl bg-gradient-to-br from-accent/20 via-purple-500/10 to-surface border border-accent/30 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              您的故事，我们来画
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              无论是小说家的视觉原型、品牌方的IP视觉化、还是您珍藏已久的故事设定——
              让AI帮您用<strong className="text-white">十分之一的时间</strong>和
              <strong className="text-white">百分之一的成本</strong>实现
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/#contact"
                className="px-8 py-3 rounded-xl bg-white text-background font-semibold hover:bg-gray-100 transition-colors"
              >
                立即咨询定制
              </Link>
              <Link
                href="/shop"
                className="px-8 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors"
              >
                看数字商品
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function PricingCard({
  name,
  price,
  unit,
  features,
  deliveryTime,
  highlight,
  badge,
}: {
  name: string;
  price: string;
  unit: string;
  features: string[];
  deliveryTime: string;
  highlight?: boolean;
  badge?: string;
}) {
  return (
    <div
      className={`relative rounded-2xl p-6 transition-all ${
        highlight
          ? "bg-gradient-to-b from-accent/15 to-surface border-2 border-accent/50 shadow-lg shadow-accent/10"
          : "bg-surface border border-border/50 hover:border-accent/30"
      }`}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-white text-xs font-medium">
          {badge}
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">{name}</h3>
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-3xl font-bold">¥{price}</span>
        <span className="text-gray-400 text-sm">{unit}</span>
      </div>
      <div className="text-xs text-gray-500 mb-5">交付周期：{deliveryTime}</div>
      <ul className="space-y-2 mb-6 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <svg
              className="w-4 h-4 text-green-400 shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-gray-300">{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
