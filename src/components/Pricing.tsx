const plans = [
  {
    name: "基础版",
    desc: "适合个人或小型项目",
    price: "299",
    unit: "/条视频",
    features: [
      "AI视频生成（15秒内）",
      "720P分辨率",
      "1次免费修改",
      "24小时交付",
      "商用授权",
    ],
    highlight: false,
  },
  {
    name: "专业版",
    desc: "适合企业和电商卖家",
    price: "899",
    unit: "/条视频",
    features: [
      "AI视频生成（60秒内）",
      "1080P / 4K分辨率",
      "3次免费修改",
      "人物一致性保持",
      "12小时优先交付",
      "商用授权 + 源文件",
    ],
    highlight: true,
  },
  {
    name: "企业定制",
    desc: "批量需求与深度定制",
    price: "面议",
    unit: "",
    features: [
      "定制AI工作流",
      "批量内容生产",
      "API接口对接",
      "专属客户经理",
      "SLA服务保障",
      "私有化部署可选",
    ],
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-accent-light text-sm font-medium tracking-wider uppercase">
            价格方案
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3">
            透明定价，物超所值
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            相比传统视频制作动辄数万元的成本，AI生成为您节省90%以上预算
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 transition-all duration-300 ${
                plan.highlight
                  ? "bg-gradient-to-b from-accent/10 to-surface border-2 border-accent/50 shadow-lg shadow-accent/10 scale-105"
                  : "bg-surface border border-border/50 hover:border-accent/30"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-white text-xs font-medium">
                  最受欢迎
                </div>
              )}
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="text-sm text-gray-400 mt-1">{plan.desc}</p>
              <div className="mt-6 mb-8">
                <span className="text-4xl font-bold">
                  {plan.price === "面议" ? "" : "¥"}
                  {plan.price}
                </span>
                <span className="text-gray-400 text-sm">{plan.unit}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
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
                    <span className="text-gray-300">{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className={`block w-full text-center py-3 rounded-xl font-medium transition-colors ${
                  plan.highlight
                    ? "bg-accent hover:bg-accent-light text-white"
                    : "bg-surface-light hover:bg-border text-gray-300"
                }`}
              >
                {plan.price === "面议" ? "联系我们" : "立即咨询"}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
