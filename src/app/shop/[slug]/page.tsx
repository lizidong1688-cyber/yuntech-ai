import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PurchaseFlow from "@/components/PurchaseFlow";
import { getProduct, getAllProducts } from "@/lib/products";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return { title: "商品不存在" };

  return {
    title: `${p.name} | ¥${p.priceYuan} | 云创未来`,
    description: p.tagline + " " + p.description.slice(0, 80),
    openGraph: {
      title: p.name,
      description: p.tagline,
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }: Params) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  // JSON-LD Product结构化数据，帮助Google理解为可售商品
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    offers: {
      "@type": "Offer",
      price: product.priceYuan,
      priceCurrency: "CNY",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "海口云创未来科技有限公司",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="pt-24 pb-24 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 面包屑 */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              首页
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-white transition-colors">
              商品
            </Link>
            <span>/</span>
            <span className="text-gray-300">{product.shortName}</span>
          </nav>

          {/* 商品头部：视觉 + 核心信息 */}
          <div className="grid lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div
                className={`aspect-square rounded-2xl bg-gradient-to-br ${product.color} p-8 flex flex-col justify-between relative overflow-hidden sticky top-24`}
              >
                {product.badge && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-white text-xs font-medium">
                    {product.badge}
                  </div>
                )}
                <div>
                  <div className="text-white/70 text-sm uppercase tracking-wider">
                    {product.tier === "pro"
                      ? "PRO 专业版"
                      : product.tier === "standard"
                        ? "标准版"
                        : "行业专版"}
                  </div>
                </div>
                <div>
                  <div className="text-white text-3xl font-bold mb-2 leading-tight">
                    {product.shortName}
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-bold text-white">
                      ¥{product.priceYuan}
                    </span>
                    {product.originalPriceYuan && (
                      <span className="text-white/50 line-through text-xl">
                        ¥{product.originalPriceYuan}
                      </span>
                    )}
                  </div>
                  <div className="text-white/70 text-sm mt-3">
                    {product.fileSize} · {product.fileFormat}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-3 leading-tight">
                  {product.name}
                </h1>
                <p className="text-lg text-accent-light leading-relaxed">
                  {product.tagline}
                </p>
              </div>

              <p className="text-gray-300 leading-relaxed">
                {product.description}
              </p>

              {/* 核心功能列表 */}
              <div className="p-5 rounded-xl bg-surface border border-border/50">
                <h2 className="font-semibold mb-3">✨ 核心功能</h2>
                <ul className="space-y-2">
                  {product.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 text-sm text-gray-300"
                    >
                      <svg
                        className="w-5 h-5 text-green-400 shrink-0 mt-0.5"
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
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 交付内容 */}
              <div className="p-5 rounded-xl bg-surface border border-border/50">
                <h2 className="font-semibold mb-3">📦 交付内容</h2>
                <ul className="space-y-2 text-sm text-gray-300">
                  {product.includes.map((i) => (
                    <li key={i} className="font-mono text-xs bg-background/50 p-2 rounded">
                      {i}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 目标人群 */}
              <div className="p-5 rounded-xl bg-accent/5 border border-accent/20">
                <h2 className="font-semibold mb-2 text-accent-light">
                  🎯 适合人群
                </h2>
                <p className="text-sm text-gray-300">
                  {product.targetAudience}
                </p>
              </div>
            </div>
          </div>

          {/* 购买流程组件 */}
          <PurchaseFlow product={product} />

          {/* 信任承诺 */}
          <div className="mt-12 p-6 rounded-xl bg-surface/50 border border-border/30">
            <h3 className="font-semibold mb-4">📜 购买前须知</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-400">
              <div>
                <div className="text-gray-300 mb-1">商业授权</div>
                <p className="leading-relaxed">
                  购买即获永久商业授权，可用于您的项目、客户交付、商业广告。
                  唯一限制：不得将本数据库本身再次转售。
                </p>
              </div>
              <div>
                <div className="text-gray-300 mb-1">交付方式</div>
                <p className="leading-relaxed">
                  支付后24小时内通过您提供的微信发送下载链接。下载链接24小时有效，请及时保存。
                </p>
              </div>
              <div>
                <div className="text-gray-300 mb-1">售后支持</div>
                <p className="leading-relaxed">
                  使用有问题可以直接联系客服。{product.tier === "pro" ? "Pro版附赠30分钟1v1远程指导。" : "标准版售后响应24小时内。"}
                </p>
              </div>
              <div>
                <div className="text-gray-300 mb-1">退款政策</div>
                <p className="leading-relaxed">
                  虚拟商品原则上不支持退款。如发现质量问题可反馈，我们会免费升级处理。
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
