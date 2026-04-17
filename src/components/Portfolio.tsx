import Link from "next/link";
import { getFeaturedShowcases } from "@/lib/showcases";

export default function Portfolio() {
  const featured = getFeaturedShowcases();

  return (
    <section id="portfolio" className="py-24 bg-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-accent-light text-sm font-medium tracking-wider uppercase">
            精选案例 · 真实项目
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3">
            客户已用AI实现的作品
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            每一个案例都来自真实交付项目，点击查看完整提示词、交付周期与参考价格
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((s) => (
            <Link
              key={s.slug}
              href={`/showcase/${s.slug}`}
              className="group block rounded-2xl overflow-hidden border border-border/50 hover:border-accent/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5"
            >
              <div
                className={`aspect-video bg-gradient-to-br ${s.color} relative flex items-center justify-center overflow-hidden`}
              >
                <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg
                    className="w-8 h-8 text-white/80 ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2 py-1 text-xs rounded-md bg-black/50 backdrop-blur text-white/90">
                    {s.industryLabel}
                  </span>
                  <span className="px-2 py-1 text-xs rounded-md bg-accent/70 backdrop-blur text-white">
                    ⭐ 精选
                  </span>
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
                <h3 className="font-semibold text-lg mb-2 group-hover:text-accent-light transition-colors line-clamp-1">
                  {s.shortTitle}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                  {s.description}
                </p>
                <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
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

        <div className="mt-12 text-center">
          <Link
            href="/showcases"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface hover:bg-surface-light border border-border/50 hover:border-accent/40 text-gray-300 hover:text-white transition-colors font-medium"
          >
            查看全部案例库
            <svg
              className="w-4 h-4"
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
      </div>
    </section>
  );
}
