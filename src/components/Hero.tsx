import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* 真实AI生成视频作为背景 */}
      <div className="absolute inset-0 -z-10">
        <video
          src="/portfolio/videos/scene-14.webm"
          poster="/portfolio/manhua-chenan/scene-14.png"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
      </div>

      {/* 光晕装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float [animation-delay:2s]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-light/60 backdrop-blur border border-border/50 text-sm text-gray-300 mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          本页背景为我们实际AI生成的视频 · Wan 2.2
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6">
          <span className="block">用真AI</span>
          <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
            做真商业视频
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-300 mb-10 leading-relaxed">
          从国风漫剧到电商产品、从房产宣传到美妆广告——
          <br className="hidden sm:block" />
          我们用本地AI工作站，<strong className="text-white">以1%的成本</strong>交付专业级商业视觉。
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/manhua"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-semibold text-lg transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
          >
            看真实AI漫剧作品 →
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-border bg-surface/60 backdrop-blur hover:border-accent-light/50 text-gray-300 hover:text-white font-medium text-lg transition-all"
          >
            逛数字商品商店
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto">
          {[
            { value: "14", label: "漫剧场景已交付" },
            { value: "3072", label: "商业提示词" },
            { value: "99%↓", label: "成本降低" },
            { value: "24h", label: "典型交付" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
