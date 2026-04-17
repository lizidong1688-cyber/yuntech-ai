import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* 动态渐变背景 + 光晕 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float [animation-delay:2s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-light/50 border border-border/50 text-sm text-gray-300 mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          真实AI生成预览 · 永久免费
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6">
          <span className="block">写Prompt的同时</span>
          <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
            立刻看到AI效果
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-300 mb-10 leading-relaxed">
          可视化镜头编辑 · <strong className="text-white">2秒真实AI图像预览</strong> · 6+平台Prompt导出
          <br className="hidden sm:block" />
          传统分镜师¥2000-5000 · 我们<strong className="text-white">30秒¥0</strong>
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/studio"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-semibold text-lg transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
          >
            免费开始创作 →
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-border bg-surface/60 backdrop-blur hover:border-accent-light/50 text-gray-300 hover:text-white font-medium text-lg transition-all"
          >
            逛商品商店
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto">
          {[
            { value: "16", label: "行业模板" },
            { value: "12", label: "视觉风格" },
            { value: "6+", label: "AI平台适配" },
            { value: "0元", label: "即开即用" },
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
