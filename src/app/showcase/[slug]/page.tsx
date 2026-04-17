import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  getShowcase,
  getAllShowcases,
  getRelatedShowcases,
} from "@/lib/showcases";

type Params = { params: Promise<{ slug: string }> };

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://yunchuangweilai.com";

// 为所有案例在构建时预渲染
export async function generateStaticParams() {
  return getAllShowcases().map((s) => ({ slug: s.slug }));
}

// 每个案例页独立的SEO元数据（核心SEO资产）
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const s = getShowcase(slug);
  if (!s) return { title: "未找到 | 云创未来" };

  const url = `${SITE_URL}/showcase/${s.slug}`;
  const ogImage = `${SITE_URL}/showcase/${s.slug}/og`;

  return {
    title: s.title,
    description: s.description,
    keywords: [
      s.industryLabel + "AI视频",
      s.styleLabel + "风格",
      s.shortTitle,
      "AI生成视频",
      "AI商业视频案例",
      "云创未来",
    ],
    alternates: { canonical: url },
    openGraph: {
      title: s.title,
      description: s.description,
      url,
      type: "article",
      locale: "zh_CN",
      images: [{ url: ogImage, width: 1200, height: 630, alt: s.title }],
      publishedTime: s.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: s.shortTitle,
      description: s.description,
      images: [ogImage],
    },
  };
}

export default async function ShowcaseDetailPage({ params }: Params) {
  const { slug } = await params;
  const s = getShowcase(slug);
  if (!s) notFound();

  const related = getRelatedShowcases(s);

  // JSON-LD 结构化数据 —— 让Google/百度精准理解页面
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: s.title,
    description: s.description,
    datePublished: s.publishedAt,
    creator: {
      "@type": "Organization",
      name: "海口云创未来科技有限公司",
      url: SITE_URL,
    },
    offers: s.price
      ? {
          "@type": "Offer",
          price: s.price.replace(/[^0-9]/g, ""),
          priceCurrency: "CNY",
          url: `${SITE_URL}/showcase/${s.slug}`,
          availability: "https://schema.org/InStock",
        }
      : undefined,
    keywords: [s.industryLabel, s.styleLabel, "AI视频", "AI生成"],
    genre: s.industryLabel,
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
            <Link
              href="/showcases"
              className="hover:text-white transition-colors"
            >
              案例库
            </Link>
            <span>/</span>
            <span className="text-gray-300">{s.shortTitle}</span>
          </nav>

          {/* 标题区 */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 text-xs rounded-full bg-accent/20 text-accent-light border border-accent/30">
                {s.industryLabel}
              </span>
              <span className="px-3 py-1 text-xs rounded-full bg-surface border border-border/50 text-gray-300">
                {s.styleLabel}
              </span>
              {s.duration && (
                <span className="px-3 py-1 text-xs rounded-full bg-surface border border-border/50 text-gray-300">
                  {s.duration}
                </span>
              )}
              {s.resolution && (
                <span className="px-3 py-1 text-xs rounded-full bg-surface border border-border/50 text-gray-300">
                  {s.resolution}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
              {s.title}
            </h1>
          </div>

          {/* 主视觉区 */}
          <div
            className={`aspect-video rounded-2xl bg-gradient-to-br ${s.color} mb-10 relative overflow-hidden flex items-center justify-center`}
          >
            <div className="w-24 h-24 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
              {s.type === "video" ? (
                <svg
                  className="w-12 h-12 text-white/80 ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg
                  className="w-12 h-12 text-white/80"
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
          </div>

          {/* 描述 */}
          <div className="prose prose-invert max-w-none mb-12">
            <p className="text-lg text-gray-300 leading-relaxed">
              {s.description}
            </p>
          </div>

          {/* 关键信息网格 */}
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            <InfoBlock label="适用场景" value={s.scenario} />
            <InfoBlock label="目标客户" value={s.clientType} />
            <InfoBlock label="交付时长" value={s.processingTime || "-"} />
            <InfoBlock
              label="参考价格"
              value={s.price ? `${s.price}起` : "面议"}
              highlight
            />
          </div>

          {/* 技术亮点 */}
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4">技术亮点</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {s.highlights.map((h) => (
                <div
                  key={h}
                  className="p-4 rounded-xl bg-surface border border-border/50 text-sm text-gray-300"
                >
                  <svg
                    className="w-5 h-5 text-accent-light mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {h}
                </div>
              ))}
            </div>
          </section>

          {/* 交付物清单 */}
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4">交付物清单</h2>
            <ul className="space-y-2">
              {s.deliverables.map((d) => (
                <li
                  key={d}
                  className="flex items-start gap-3 p-3 rounded-xl bg-surface/50 border border-border/30"
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
                  <span className="text-gray-300">{d}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 使用的AI提示词（展示专业度） */}
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-2">本案例使用的AI提示词</h2>
            <p className="text-sm text-gray-500 mb-4">
              以下是我们为本项目设计的完整AI生成提示词——专业的提示词工程是AI商业视频质量的关键
            </p>
            <div className="p-5 rounded-xl bg-background/60 border border-border/50 font-mono text-sm text-gray-200 leading-relaxed">
              {s.prompt}
            </div>
            <div className="mt-4 text-sm text-gray-500">
              想为自己的项目生成类似质量的提示词？
              <Link
                href="/#generator"
                className="text-accent-light hover:underline ml-1"
              >
                使用我们的免费提示词生成器 →
              </Link>
            </div>
          </section>

          {/* 转化CTA */}
          <section className="p-10 rounded-2xl bg-gradient-to-br from-accent/20 to-purple-500/20 border border-accent/40 text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              想要同类作品？我们可以为您定制
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              把您的需求告诉我们，24小时内生成属于您的专属AI视频样片——
              <strong className="text-white">首次咨询免费出一条样片。</strong>
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/#contact"
                className="px-8 py-3 rounded-xl bg-white text-background font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                立即咨询定制同类作品 →
              </Link>
              <Link
                href="/#generator"
                className="px-8 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors"
              >
                先试用免费工具
              </Link>
            </div>
          </section>

          {/* 相关案例 */}
          {related.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-6">相关案例推荐</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/showcase/${r.slug}`}
                    className="group block rounded-xl overflow-hidden border border-border/50 hover:border-accent/30 transition-colors"
                  >
                    <div
                      className={`aspect-video bg-gradient-to-br ${r.color} flex items-center justify-center`}
                    >
                      <svg
                        className="w-10 h-10 text-white/50"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <div className="p-4 bg-surface">
                      <p className="text-xs text-gray-500 mb-1">
                        {r.industryLabel} · {r.styleLabel}
                      </p>
                      <h3 className="font-medium text-sm group-hover:text-accent-light transition-colors line-clamp-2">
                        {r.shortTitle}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function InfoBlock({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-5 rounded-xl border ${highlight ? "bg-accent/10 border-accent/30" : "bg-surface border-border/50"}`}
    >
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
        {label}
      </p>
      <p
        className={`text-base ${highlight ? "text-accent-light font-semibold" : "text-gray-200"}`}
      >
        {value}
      </p>
    </div>
  );
}
