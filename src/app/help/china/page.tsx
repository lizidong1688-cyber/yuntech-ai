import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "中国大陆访问指南 · 国内用户必读 | 云创未来",
  description:
    "访问云创未来 yuntech-ai.vercel.app 遇到打不开、加载慢、图片不显示？这里有完整的解决方案和备用通道。",
  robots: { index: true, follow: true },
};

export default function ChinaAccessHelpPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-24 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 面包屑 */}
          <nav className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-white">首页</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-300">中国访问帮助</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            🇨🇳 中国大陆访问指南
          </h1>
          <p className="text-gray-400 mb-10 leading-relaxed">
            我们的服务器部署在海外Vercel CDN，国内访问在部分网络环境下可能出现
            <strong className="text-white">打不开、加载慢、图片卡住</strong>的情况。
            以下是经过验证的解决方案，按效果从好到差排序。
          </p>

          {/* 问题自检 */}
          <section className="mb-10 p-5 rounded-xl bg-surface border border-border/50">
            <h2 className="text-lg font-semibold mb-3">⚡ 快速自检</h2>
            <div className="space-y-3 text-sm">
              <DiagRow
                issue="整个网站打不开"
                solution="方案A（换DNS）或方案C（手机4G/5G）"
              />
              <DiagRow
                issue="能打开但加载很慢（>10秒）"
                solution="方案A换DNS通常见效"
              />
              <DiagRow
                issue="首页能看，但AI图片不出来"
                solution="这是/api/ai-image接口超时，方案A+D组合解决"
              />
              <DiagRow
                issue="点任何链接都转圈不动"
                solution="方案E切换到手机热点"
              />
            </div>
          </section>

          {/* 方案A：换DNS */}
          <Solution
            letter="A"
            title="换用国内优质DNS（推荐，3分钟搞定）"
            difficulty="⭐ 非常简单"
            effect="90%有效"
          >
            <p className="mb-3">
              默认DNS往往是运营商的，解析{" "}
              <code className="text-accent-light">.vercel.app</code>{" "}
              会绕远路。换用阿里或腾讯的公共DNS可大幅改善。
            </p>
            <ul className="space-y-2 mb-4">
              <li>
                <strong className="text-accent-light">阿里公共DNS：</strong>{" "}
                <code>223.5.5.5</code> / <code>223.6.6.6</code>
              </li>
              <li>
                <strong className="text-accent-light">腾讯公共DNS：</strong>{" "}
                <code>119.29.29.29</code> / <code>182.254.116.116</code>
              </li>
              <li>
                <strong className="text-accent-light">Cloudflare：</strong>{" "}
                <code>1.1.1.1</code> / <code>1.0.0.1</code>
              </li>
            </ul>
            <details className="text-sm">
              <summary className="cursor-pointer text-accent-light hover:text-white">
                Windows / Mac 怎么改DNS？（点击展开）
              </summary>
              <div className="mt-3 p-4 rounded-lg bg-background/50 border border-border/30 space-y-2 text-gray-400">
                <p>
                  <strong className="text-gray-300">Windows 10/11：</strong>
                </p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>设置 → 网络和Internet → 以太网/WiFi</li>
                  <li>点击当前连接 → DNS服务器分配 → 编辑 → 手动 → IPv4</li>
                  <li>首选DNS填 <code>223.5.5.5</code>，备用DNS填 <code>119.29.29.29</code></li>
                  <li>保存后按 Win+R 输入 <code>cmd</code>，执行 <code>ipconfig /flushdns</code></li>
                </ol>
                <p>
                  <strong className="text-gray-300">Mac：</strong>
                </p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>系统偏好设置 → 网络 → 选中当前连接 → 高级 → DNS</li>
                  <li>点+号添加 <code>223.5.5.5</code> 和 <code>119.29.29.29</code></li>
                  <li>好 → 应用</li>
                </ol>
              </div>
            </details>
          </Solution>

          {/* 方案B：换浏览器 */}
          <Solution
            letter="B"
            title="使用 Edge/Chrome，并清除缓存"
            difficulty="⭐ 非常简单"
            effect="偶尔有效"
          >
            <p>
              国产双核浏览器（如QQ、360）有时会拦截vercel.app。
              推荐使用 Microsoft Edge 或 Google Chrome，并按 Ctrl+Shift+Del
              清除缓存和Cookie后重试。
            </p>
          </Solution>

          {/* 方案C：切换网络 */}
          <Solution
            letter="C"
            title="手机4G/5G 或 家用宽带切换"
            difficulty="⭐ 非常简单"
            effect="80%有效"
          >
            <p>
              不同运营商的海外线路质量差异极大：
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li><strong className="text-gray-200">电信</strong>：国际出口最好，优先尝试</li>
              <li><strong className="text-gray-200">移动/联通</strong>：海外访问较差，可尝试切换手机4G/5G热点</li>
              <li>如果公司/家用宽带访问慢，可以临时用手机流量测试</li>
            </ul>
          </Solution>

          {/* 方案D：AI功能降级 */}
          <Solution
            letter="D"
            title="AI图片预览超时？手动复制Prompt"
            difficulty="⭐⭐ 中等"
            effect="100%有效"
          >
            <p className="mb-3">
              如果你在 /studio 填好镜头，点 &quot;生成AI预览&quot; 但图片不出现，
              通常是因为AI生成服务的API响应慢。这时有两个选择：
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>
                <strong className="text-white">耐心等待30-45秒</strong>：我们已经设置了自动重试机制
              </li>
              <li>
                <strong className="text-white">点&quot;复制Prompt去其他平台&quot;</strong>：
                失败后会出现这个按钮，把编译好的专业Prompt复制到可灵/即梦/Vidu等国产AI平台（国内访问无压力）
              </li>
            </ol>
          </Solution>

          {/* 方案E：移动分享 */}
          <Solution
            letter="E"
            title="直接用手机+移动流量访问"
            difficulty="⭐ 非常简单"
            effect="90%有效"
          >
            <p>
              在公司WiFi或校园网下遇到打不开，切换到手机4G/5G流量（不是热点）通常立刻可用。
              <br />
              首次访问后浏览器会缓存，之后即使切回WiFi也会快很多。
            </p>
          </Solution>

          {/* CDN优化说明 */}
          <div className="mt-10 p-5 rounded-xl bg-accent/5 border border-accent/20">
            <h3 className="font-semibold mb-2">我们已经做的优化</h3>
            <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
              <li>Serverless函数已配置香港/新加坡/东京节点（离中国大陆最近的Vercel可用节点）</li>
              <li>所有静态资源打包自托管（零Google Fonts/CDN外链）</li>
              <li>JS/CSS启用Brotli压缩，首屏资源尽量精简</li>
              <li>AI图片响应启用7天CDN缓存（热门Prompt国内加载秒开）</li>
            </ul>
          </div>

          {/* 终极方案 */}
          <div className="mt-6 p-5 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30">
            <h3 className="font-semibold mb-2 text-amber-200">
              🚀 更稳定的体验？
            </h3>
            <p className="text-sm text-gray-300 mb-3">
              我们正在申请.cn备案域名，预计2-4周上线独立中国镜像。
              届时国内访问速度将达到 <strong className="text-white">100-200毫秒</strong>
              （目前平均2-3秒）。
            </p>
            <p className="text-sm text-gray-400">
              购买Pro版可加入内测名单，镜像上线后优先获得专用访问链接：
            </p>
            <Link
              href="/shop/prompts-pro"
              className="inline-block mt-3 px-5 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-medium transition-colors text-sm"
            >
              了解Pro版 →
            </Link>
          </div>

          {/* 反馈 */}
          <div className="mt-10 text-center text-sm text-gray-500">
            <p>以上方法都试过了还是不行？</p>
            <Link
              href="/#contact"
              className="text-accent-light hover:text-white underline"
            >
              告诉我们您的访问问题 →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function DiagRow({
  issue,
  solution,
}: {
  issue: string;
  solution: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="shrink-0 text-red-300">问题：</span>
      <div className="flex-1">
        <p className="text-gray-300">{issue}</p>
        <p className="text-gray-500 text-xs mt-0.5">
          → {solution}
        </p>
      </div>
    </div>
  );
}

function Solution({
  letter,
  title,
  difficulty,
  effect,
  children,
}: {
  letter: string;
  title: string;
  difficulty: string;
  effect: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-6 p-5 rounded-xl bg-surface border border-border/50">
      <div className="flex items-center gap-3 mb-3">
        <span className="shrink-0 w-9 h-9 rounded-lg bg-accent/20 text-accent-light flex items-center justify-center font-bold">
          {letter}
        </span>
        <h2 className="text-lg font-semibold flex-1">{title}</h2>
      </div>
      <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
        <span>{difficulty}</span>
        <span>·</span>
        <span className="text-accent-light">{effect}</span>
      </div>
      <div className="text-sm text-gray-300 leading-relaxed">{children}</div>
    </section>
  );
}
