import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAllShowcases, getAllIndustries } from "@/lib/showcases";

export const metadata: Metadata = {
  title: "AI视频与图像案例库 | 云创未来商业作品集",
  description:
    "精选20+真实AI商业案例：电商产品视频、房产楼盘宣传、餐饮美食展示、美妆广告、婚礼请柬、科技发布、教育招生、健身运动。真实案例、真实提示词、真实交付周期。",
  keywords: [
    "AI视频案例",
    "AI商业视频",
    "电商视频案例",
    "房产AI视频",
    "餐饮AI视频",
    "品牌AI宣传",
    "海南AI公司案例",
  ],
  openGraph: {
    title: "AI视频与图像案例库 | 云创未来",
    description: "精选20+真实AI商业案例，覆盖电商、房产、餐饮、美妆、婚礼等8大行业",
    type: "website",
    locale: "zh_CN",
  },
};

export default function ShowcasesPage() {
  const showcases = getAllShowcases();
  const industries = getAllIndustries();

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 页面头部 */}
          <div className="text-center mb-12">
            <span className="text-accent-light text-sm font-medium tracking-wider uppercase">
              案例库 · Case Studies
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold mt-3 mb-6">
              真实商业案例，真实交付成果
            </h1>
            <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed">
              以下每一个案例都来自真实服务订单，包含完整的提示词、交付周期、参考价格。
              <br className="hidden sm:block" />
              点击任意案例查看详情，或直接咨询为您定制同类作品。
            </p>
          </div>

          {/* 行业筛选（静态呈现） */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <span className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium">
              全部案例 · {showcases.length}
            </span>
            {industries.map((ind) => (
              <a
                key={ind.value}
                href={`#${ind.value}`}
                className="px-4 py-2 rounded-lg bg-surface hover:bg-surface-light text-gray-300 text-sm transition-colors"
              >
                {ind.label} · {ind.count}
              </a>
            ))}
          </div>

          {/* 案例网格 */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {showcases.map((s) => (
              <Link
                key={s.slug}
                href={`/showcase/${s.slug}`}
                className="group block rounded-2xl overflow-hidden border border-border/50 hover:border-accent/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5"
              >
                <div
                  className={`aspect-video bg-gradient-to-br ${s.color} relative overflow-hidden flex items-center justify-center`}
                >
                  {/* 播放图标 */}
                  <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform">
                    {s.type === "video" ? (
                      <svg
                        className="w-8 h-8 text-white/80 ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-8 h-8 text-white/80"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </div>
                  {/* 标签 */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2 py-1 text-xs rounded-md bg-black/50 backdrop-blur text-white/90">
                      {s.industryLabel}
                    </span>
                    {s.featured && (
                      <span className="px-2 py-1 text-xs rounded-md bg-accent/80 backdrop-blur text-white">
                        ⭐ 精选
                      </span>
                    )}
                  </div>
                  {s.duration && (
                    <div className="absolute bottom-3 right-3 px-2 py-1 text-xs rounded-md bg-black/50 backdrop-blur text-white/90">
                      {s.duration}
                    </div>
                  )}
                </div>

                <div className="p-5 bg-surface">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <span>{s.styleLabel}</span>
                    <span>·</span>
                    <span>{s.resolution}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-accent-light transition-colors">
                    {s.shortTitle}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                    {s.description}
                  </p>
                  <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {s.processingTime} 交付
                    </span>
                    {s.price && (
                      <span className="text-sm font-semibold text-accent-light">
                        {s.price}起
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* 底部CTA */}
          <div className="mt-20 p-10 rounded-2xl bg-gradient-to-br from-accent/20 to-purple-500/20 border border-accent/30 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              您的行业没在列表中？
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              我们服务的行业远不止这些——告诉我们您的需求，24小时内生成专属于您的AI样片
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/#generator"
                className="px-8 py-3 rounded-xl bg-white text-background font-semibold hover:bg-gray-100 transition-colors"
              >
                试用免费提示词工具 →
              </Link>
              <Link
                href="/#contact"
                className="px-8 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors"
              >
                直接咨询定制方案
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
