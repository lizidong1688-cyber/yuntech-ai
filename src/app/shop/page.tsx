import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  getAllProducts,
  getHighlightedProducts,
  getIndustryProducts,
} from "@/lib/products";

export const metadata: Metadata = {
  title: "AI视频提示词宝典 | 数字商品商店 | 云创未来",
  description:
    "3072条商业级AI视频提示词，16大行业全覆盖。即买即发，永久使用。标准版29.9元，Pro版99元，行业版19.9元起。",
  keywords: [
    "AI视频提示词",
    "AI视频模板",
    "AI商业视频",
    "ComfyUI工作流",
    "电商视频提示词",
    "房产AI视频",
  ],
  openGraph: {
    title: "AI视频提示词宝典 | 数字商品商店",
    description: "3072条商业级AI视频提示词，16行业全覆盖，29.9元即可拥有",
    type: "website",
    locale: "zh_CN",
  },
};

export default function ShopPage() {
  const highlighted = getHighlightedProducts();
  const industry = getIndustryProducts();

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 头部 */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-sm text-accent-light mb-4">
              🎁 限时优惠中 · 即买即发
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mt-3 mb-6">
              AI视频提示词宝典
            </h1>
            <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed">
              3072条商业级提示词 · 16大行业 × 12种风格
              <br className="hidden sm:block" />
              下单后24小时内发送下载链接到您的微信
            </p>
          </div>

          {/* 主推商品 */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">🌟 主推商品</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {highlighted.map((p) => (
                <Link
                  key={p.slug}
                  href={`/shop/${p.slug}`}
                  className={`group block rounded-2xl overflow-hidden border border-border/50 hover:border-accent/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5 bg-surface`}
                >
                  <div
                    className={`aspect-[16/9] bg-gradient-to-br ${p.color} p-8 flex flex-col justify-between relative overflow-hidden`}
                  >
                    {p.badge && (
                      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-white text-xs font-medium">
                        {p.badge}
                      </div>
                    )}
                    <div className="text-white/90 text-sm">
                      {p.tier === "pro" ? "Pro版本" : "标准版本"}
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold text-white">
                          ¥{p.priceYuan}
                        </span>
                        {p.originalPriceYuan && (
                          <span className="text-white/50 line-through text-lg">
                            ¥{p.originalPriceYuan}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-accent-light transition-colors">
                      {p.shortName}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-4">
                      {p.tagline}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-border/30">
                      <span className="text-xs text-gray-500">
                        {p.fileSize} · {p.fileFormat.split("（")[0]}
                      </span>
                      <span className="text-sm font-semibold text-accent-light group-hover:text-white transition-colors">
                        立即购买 →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* 行业细分版 */}
          <section>
            <h2 className="text-2xl font-bold mb-2 text-center">
              🎯 按行业精选
            </h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              只需要特定行业？选择你的细分版，19.9元起
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {industry.map((p) => (
                <Link
                  key={p.slug}
                  href={`/shop/${p.slug}`}
                  className="group block rounded-xl overflow-hidden border border-border/50 hover:border-accent/40 transition-all bg-surface"
                >
                  <div
                    className={`aspect-square bg-gradient-to-br ${p.color} p-5 flex flex-col justify-between`}
                  >
                    <div className="text-white/80 text-xs">行业专版</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-white">
                        ¥{p.priceYuan}
                      </span>
                      {p.originalPriceYuan && (
                        <span className="text-white/40 line-through text-xs">
                          ¥{p.originalPriceYuan}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-1 group-hover:text-accent-light transition-colors line-clamp-1">
                      {p.shortName}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {p.tagline}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* 信任承诺 */}
          <section className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "⚡", title: "快速交付", desc: "24小时内发货" },
              { icon: "🔐", title: "永久使用", desc: "商用授权齐全" },
              { icon: "🔄", title: "终身更新", desc: "新版免费推送" },
              { icon: "💬", title: "售后无忧", desc: "问题随时解决" },
            ].map((item) => (
              <div
                key={item.title}
                className="p-5 rounded-xl bg-surface border border-border/50 text-center"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-semibold text-sm">{item.title}</div>
                <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
              </div>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
