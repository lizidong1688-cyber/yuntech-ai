export default function Footer() {
  return (
    <footer className="py-12 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                云
              </div>
              <span className="text-lg font-bold">
                云创<span className="text-accent-light">未来</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              海口云创未来科技有限公司
              <br />
              AI赋能商业内容创作
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">服务</h4>
            <ul className="space-y-2">
              {[
                "AI视频生成",
                "AI图像创作",
                "AI人物一致性",
                "定制化方案",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#services"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">应用场景</h4>
            <ul className="space-y-2">
              {[
                "电商产品展示",
                "品牌社交媒体",
                "房产宣传片",
                "婚礼邀请函",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#portfolio"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">公司</h4>
            <ul className="space-y-2">
              {[
                { label: "关于我们", href: "#about" },
                { label: "联系我们", href: "#contact" },
                { label: "价格方案", href: "#pricing" },
                { label: "🇨🇳 国内访问慢？", href: "/help/china" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; 2026 海口云创未来科技有限公司. 保留所有权利.
          </p>
          <p className="text-sm text-gray-500">
            琼ICP备XXXXXXXX号-1
          </p>
        </div>
      </div>
    </footer>
  );
}
