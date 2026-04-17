const services = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    title: "AI视频生成",
    desc: "基于Wan 2.2 14B大模型，文字描述即可生成高质量商业视频。支持产品展示、品牌宣传、社交媒体短视频等多种场景。",
    tags: ["产品视频", "品牌宣传", "社交短视频"],
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "AI图像创作",
    desc: "Flux Dev高清图像生成，电商主图、海报设计、社交媒体配图一键生成。支持多种风格，精准还原您的创意构想。",
    tags: ["电商主图", "海报设计", "品牌素材"],
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "AI人物一致性",
    desc: "PuLID人脸一致性技术，让同一虚拟角色在不同场景中保持统一外观。品牌IP形象、虚拟代言人的最佳选择。",
    tags: ["虚拟IP", "品牌形象", "一致性角色"],
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "定制化解决方案",
    desc: "根据企业特定需求，定制AI内容生产工作流。从批量电商图到自动化视频流水线，量身打造您的AI内容工厂。",
    tags: ["工作流定制", "批量生产", "API对接"],
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-accent-light text-sm font-medium tracking-wider uppercase">
            我们的服务
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3">
            AI赋能，重新定义内容创作
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            我们将最前沿的AI生成技术转化为商业级解决方案，帮助企业以极低成本获得专业品质的视觉内容
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="group p-8 rounded-2xl bg-surface border border-border/50 hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5"
            >
              <div className="w-14 h-14 rounded-xl bg-accent/10 text-accent-light flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors">
                {s.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{s.title}</h3>
              <p className="text-gray-400 leading-relaxed mb-4">{s.desc}</p>
              <div className="flex flex-wrap gap-2">
                {s.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs rounded-full bg-surface-light text-gray-400 border border-border/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
