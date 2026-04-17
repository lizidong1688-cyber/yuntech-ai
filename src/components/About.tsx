const advantages = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "本地算力，数据安全",
    desc: "全部模型本地部署运行，您的商业数据和创意不会上传任何第三方云端",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "极速交付",
    desc: "AI生成无需排期、无需拍摄团队，从需求到成品最快几分钟完成",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "成本革命",
    desc: "传统视频制作数万元起步，AI生成仅需百元级别，效果媲美专业团队",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "海南自贸港企业",
    desc: "注册于海南自贸港，享受国家级政策优惠，为客户提供更有竞争力的价格",
  },
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-accent-light text-sm font-medium tracking-wider uppercase">
              关于我们
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3">
              海口云创未来科技
            </h2>
            <p className="text-gray-400 mt-6 leading-relaxed">
              我们是一家立足海南自贸港的AI科技公司，专注于将最前沿的人工智能生成技术（AIGC）转化为商业级解决方案。
            </p>
            <p className="text-gray-400 mt-4 leading-relaxed">
              我们自建本地AI算力集群，部署了全球领先的视频生成模型Wan
              2.2和图像生成模型Flux，能够为企业客户提供从创意构思到内容交付的一站式AI内容生产服务。
            </p>
            <p className="text-gray-400 mt-4 leading-relaxed">
              我们相信，AI将彻底改变内容创作行业。我们的使命是让每一家企业都用得起、用得好AI——
              <span className="text-white font-medium">
                让技术为商业创造真正的价值。
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {advantages.map((a) => (
              <div
                key={a.title}
                className="p-5 rounded-xl bg-surface border border-border/50 hover:border-accent/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent-light flex items-center justify-center mb-3">
                  {a.icon}
                </div>
                <h3 className="font-semibold mb-1">{a.title}</h3>
                <p className="text-sm text-gray-400">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
