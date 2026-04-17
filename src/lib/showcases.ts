/**
 * AI创作案例库
 *
 * 每个案例都是一个独立的SEO资产：
 * - 独立URL，独立标题和描述，独立OG图
 * - 结构化数据帮助搜索引擎理解
 * - 引导到提示词生成器或联系表单的转化通道
 *
 * 策略：初始批量预埋20+高质量案例，覆盖所有行业的核心场景
 * 每当ComfyUI生成真实样片，只需往这个数组加一条即可自动上线SEO页面
 */

export type ShowcaseType = "video" | "image" | "character";

export interface Showcase {
  slug: string; // URL路径
  title: string; // 页面标题（SEO关键）
  shortTitle: string; // 卡片简短标题
  type: ShowcaseType;
  industry: string; // 对应promptGenerator的行业key
  industryLabel: string;
  style: string;
  styleLabel: string;
  description: string; // 案例描述，富含关键词
  scenario: string; // 使用场景
  clientType: string; // 目标客户画像
  prompt: string; // 实际使用的提示词（展示专业度）
  highlights: string[]; // 技术亮点
  deliverables: string[]; // 交付物
  duration?: string;
  resolution?: string;
  processingTime?: string; // 典型交付时长
  price?: string; // 参考价格
  color: string; // 卡片渐变配色
  publishedAt: string; // ISO日期
  featured?: boolean; // 是否首页精选
}

// ============================================================
// 20条初始案例 —— 覆盖8大行业的典型商业场景
// ============================================================
export const SHOWCASES: Showcase[] = [
  // ========== 电商产品（4条） ==========
  {
    slug: "ecommerce-ceramic-cup-luxury",
    title: "轻奢陶瓷咖啡杯AI产品视频 | 电商详情页首屏",
    shortTitle: "轻奢陶瓷杯产品视频",
    type: "video",
    industry: "ecommerce",
    industryLabel: "电商产品",
    style: "luxurious",
    styleLabel: "高级奢华",
    description:
      "为国内某新锐陶瓷品牌制作的电商详情页首屏视频。15秒镜头完整展现产品360度外观、釉面质感、使用场景，替代了传统3000元预算的棚拍，客户一周内复购3次。",
    scenario: "天猫/京东商品详情页首屏、小红书种草视频",
    clientType: "淘宝/天猫品牌店、独立设计师品牌",
    prompt:
      "15秒高级奢华风格的轻奢白色陶瓷咖啡杯产品视频。镜头：缓慢360度环绕特写，浅景深聚焦杯口釉面。光线：柔和顶光配合金色侧逆光，突出瓷器质感。色彩：深黑金色调，高饱和度。场景：大理石台面，散落的咖啡豆与蒸汽。情绪：尊贵精致。节奏：优雅从容，富有仪式感。",
    highlights: [
      "高级釉面反光质感AI精准还原",
      "咖啡蒸汽物理效果自然流畅",
      "360度环绕无接缝运镜",
    ],
    deliverables: [
      "1080P主视频 × 1条",
      "9:16竖屏版本 × 1条（小红书/抖音）",
      "前3秒循环GIF × 1份",
    ],
    duration: "15秒",
    resolution: "1080P / 4K可选",
    processingTime: "12小时",
    price: "899元",
    color: "from-amber-500/30 to-orange-600/30",
    publishedAt: "2026-04-10",
    featured: true,
  },
  {
    slug: "ecommerce-skincare-bottle-minimal",
    title: "护肤精华液产品视频 | 极简风AI广告素材",
    shortTitle: "精华液极简广告",
    type: "video",
    industry: "beauty",
    industryLabel: "美妆护肤",
    style: "minimalist",
    styleLabel: "极简",
    description:
      "为美妆品牌制作的精华液产品素材，极简白色背景配合滴液慢动作。单条视频在抖音信息流投放，CTR较传统素材提升47%。",
    scenario: "抖音/快手信息流广告、天猫主图视频",
    clientType: "国货美妆品牌、跨境美妆卖家",
    prompt:
      "10秒极简风格的护肤精华液产品视频。镜头：产品从白色留白背景中央缓慢升起，滴管挤出透明液体的微距特写。光线：环形柔光均匀打亮。色彩：纯白背景配合产品自身色彩，低饱和度。情绪：纯净高级。节奏：极慢呼吸感。",
    highlights: ["液体表面张力细节AI级还原", "纯白背景零污染", "留白构图高级感"],
    deliverables: ["主视频 × 1条", "16:9信息流版本", "1:1方形版本"],
    duration: "10秒",
    resolution: "1080P",
    processingTime: "8小时",
    price: "499元",
    color: "from-pink-500/20 to-rose-400/20",
    publishedAt: "2026-04-08",
    featured: true,
  },
  {
    slug: "ecommerce-sneaker-dynamic",
    title: "潮牌运动鞋动感广告 | 电商详情页与抖音投流",
    shortTitle: "运动鞋潮流广告",
    type: "video",
    industry: "ecommerce",
    industryLabel: "电商产品",
    style: "dynamic",
    styleLabel: "动感潮流",
    description:
      "为原创潮牌制作的运动鞋广告，快速切换的镜头配合鞋面材质特写。上线7天销量提升2.3倍。",
    scenario: "抖音电商投流、小红书KOC种草",
    clientType: "潮牌服饰、运动品牌",
    prompt:
      "15秒动感潮流风格的白色低帮运动鞋广告视频。镜头：快速推拉、鞋底细节特写、穿行街头的视角切换。光线：霓虹灯反射配合硬光。色彩：高饱和撞色。场景：潮流街头涂鸦墙。节奏：急促配合节拍。",
    highlights: ["GoPro视角AI合成", "霓虹反射材质真实", "节奏踩点精准"],
    deliverables: ["竖屏视频 × 1条", "前5秒高能片段剪辑"],
    duration: "15秒",
    resolution: "1080P",
    processingTime: "12小时",
    price: "899元",
    color: "from-violet-500/30 to-fuchsia-500/30",
    publishedAt: "2026-04-05",
  },
  {
    slug: "ecommerce-jewelry-closeup",
    title: "珠宝首饰高清特写视频 | 电商详情页珠宝级呈现",
    shortTitle: "珠宝首饰特写",
    type: "video",
    industry: "ecommerce",
    industryLabel: "电商产品",
    style: "cinematic",
    styleLabel: "电影感",
    description:
      "为独立珠宝设计师制作的钻石吊坠广告，微距镜头展现每一个切面的火彩。用于天猫旗舰店和抖音直播间背景。",
    scenario: "珠宝电商详情页、直播间背景、品牌官网",
    clientType: "独立珠宝品牌、定制珠宝工作室",
    prompt:
      "10秒电影感风格的钻石吊坠微距特写视频。镜头：从水平缓慢倾斜至俯视，捕捉每个切面的火彩。光线：多角度精准硬光。色彩：青橙电影色调。场景：深色丝绒背景，隐约的光源反射。情绪：神秘高贵。",
    highlights: ["钻石火彩逼真还原", "丝绒质感层次分明", "珠宝级光线布控"],
    deliverables: ["主视频 × 1条", "静态高清截图 × 5张"],
    duration: "10秒",
    resolution: "4K",
    processingTime: "16小时",
    price: "1299元",
    color: "from-slate-400/20 to-blue-400/20",
    publishedAt: "2026-04-02",
  },

  // ========== 房产楼盘（3条） ==========
  {
    slug: "realestate-seaview-villa-tour",
    title: "海景别墅AI漫游视频 | 三亚房产宣传",
    shortTitle: "海景别墅漫游",
    type: "video",
    industry: "realestate",
    industryLabel: "房产楼盘",
    style: "cinematic",
    styleLabel: "电影感",
    description:
      "为三亚某高端别墅项目制作的样板间漫游视频，替代了传统20万+的航拍与实景拍摄预算。单条视频带来37组实地看房。",
    scenario: "房产中介朋友圈、抖音信息流、项目官网",
    clientType: "三亚/海口高端楼盘、旅居地产开发商",
    prompt:
      "30秒电影感风格的海景别墅宣传视频。镜头：无人机从高空俯冲进入前门，穿过大堂推进至客厅落地窗，运镜定格海景。光线：金色黄昏时刻。色彩：青橙分级，暖色高光。场景：现代简约装修，窗外三亚海景。情绪：奢华向往。节奏：富有张力。",
    highlights: [
      "无人机镜头AI合成，零实拍成本",
      "海景+建筑无接缝融合",
      "黄昏光线戏剧化呈现",
    ],
    deliverables: [
      "主宣传片 × 1条（30秒）",
      "社交媒体竖版 × 2条（15秒×2）",
      "项目客户群分发版（带水印）",
    ],
    duration: "30秒",
    resolution: "4K",
    processingTime: "24小时",
    price: "2999元",
    color: "from-blue-500/30 to-cyan-500/30",
    publishedAt: "2026-04-12",
    featured: true,
  },
  {
    slug: "realestate-apartment-warm",
    title: "三居室样板间AI宣传视频 | 温馨风家庭户型",
    shortTitle: "三居室样板间",
    type: "video",
    industry: "realestate",
    industryLabel: "房产楼盘",
    style: "warm",
    styleLabel: "温馨",
    description:
      "为中端改善型楼盘制作的三居室样板间视频，温馨生活化氛围吸引刚需家庭客群。转化看房成本下降60%。",
    scenario: "链家/贝壳房源视频、楼盘销售中心大屏",
    clientType: "中端改善型楼盘、二手房中介",
    prompt:
      "25秒温馨风格的三居室样板间宣传视频。镜头：从玄关柔和推进客厅，扫过儿童房的书桌玩具，定格在阳台的茶几绿植。光线：清晨自然光透过落地窗。色彩：奶茶色暖调。场景：生活化陈设，绿植与画作点缀。情绪：治愈温暖。",
    highlights: [
      "生活化细节还原度极高",
      "自然光线层次感丰富",
      "温馨氛围代入感强",
    ],
    deliverables: ["主视频 × 1条", "户型图解说版 × 1条"],
    duration: "25秒",
    resolution: "1080P",
    processingTime: "20小时",
    price: "1599元",
    color: "from-orange-400/20 to-amber-300/20",
    publishedAt: "2026-04-07",
  },
  {
    slug: "realestate-commercial-futuristic",
    title: "商业综合体概念宣传视频 | 未来科技风招商素材",
    shortTitle: "商业综合体概念片",
    type: "video",
    industry: "realestate",
    industryLabel: "房产楼盘",
    style: "futuristic",
    styleLabel: "未来科技",
    description:
      "为尚未建成的商业综合体制作的招商宣传片，用AI提前呈现建成效果，助力签约意向客户。",
    scenario: "招商会展示、投资方路演、项目公众号",
    clientType: "商业地产开发商、招商团队",
    prompt:
      "40秒未来科技风格的商业综合体宣传视频。镜头：建筑从粒子中浮现，剖开展示内部空间，UI数据叠加。光线：冷蓝基调霓虹点缀。色彩：高对比硬光。情绪：前沿震撼。",
    highlights: ["建筑效果提前AI可视化", "粒子特效质感", "数据叠加信息密度"],
    deliverables: ["主宣传片", "招商PPT嵌入版"],
    duration: "40秒",
    resolution: "4K",
    processingTime: "36小时",
    price: "4999元",
    color: "from-indigo-500/30 to-purple-600/30",
    publishedAt: "2026-04-03",
  },

  // ========== 餐饮美食（3条） ==========
  {
    slug: "food-seafood-restaurant-hainan",
    title: "三亚海鲜餐厅宣传片 | 美食诱惑AI视频",
    shortTitle: "三亚海鲜餐厅",
    type: "video",
    industry: "food",
    industryLabel: "餐饮美食",
    style: "warm",
    styleLabel: "温馨",
    description:
      "为三亚本地海鲜餐厅制作的招牌菜品展示视频，热气腾腾的蒸煮画面成为抖音爆款素材。",
    scenario: "抖音同城美食种草、美团大众点评首图",
    clientType: "地方特色餐厅、连锁餐饮品牌",
    prompt:
      "15秒温馨风格的三亚海鲜招牌菜展示视频。镜头：滚烫海鲜从空中落入蒸笼的慢镜头，顶视图展示摆盘，筷子夹起鱼肉的特写。光线：温暖侧逆光。色彩：奶茶暖调。场景：原木餐桌，椰子叶点缀。情绪：诱人治愈。",
    highlights: ["热气腾腾真实感", "食材纹理AI精准", "海南风情点缀"],
    deliverables: ["主视频", "菜品单品卡片 × 3张"],
    duration: "15秒",
    resolution: "1080P",
    processingTime: "10小时",
    price: "699元",
    color: "from-red-500/30 to-amber-500/30",
    publishedAt: "2026-04-14",
    featured: true,
  },
  {
    slug: "food-coffee-shop-fresh",
    title: "精品咖啡店宣传视频 | 清新文艺早午餐",
    shortTitle: "精品咖啡店",
    type: "video",
    industry: "food",
    industryLabel: "餐饮美食",
    style: "fresh",
    styleLabel: "清新",
    description:
      "为独立咖啡店制作的品牌宣传视频，清新文艺风格精准吸引周边3公里年轻白领。",
    scenario: "小红书探店种草、咖啡店社交账号",
    clientType: "独立咖啡店、精品烘焙",
    prompt:
      "15秒清新风格的精品咖啡店宣传视频。镜头：咖啡师拉花慢动作，蛋糕切开的横截面，客人手捧杯子的温馨特写。光线：明亮自然光从窗户进入。色彩：薄荷绿天空蓝。场景：原木吧台，绿植与陶瓷杯。情绪：年轻愉悦。",
    highlights: ["拉花细节逼真", "蛋糕截面层次", "日系文艺氛围"],
    deliverables: ["主视频", "单品产品视频 × 2条"],
    duration: "15秒",
    resolution: "1080P",
    processingTime: "10小时",
    price: "599元",
    color: "from-emerald-400/20 to-teal-300/20",
    publishedAt: "2026-04-09",
  },
  {
    slug: "food-hotpot-dynamic",
    title: "火锅店广告短视频 | 动感食欲直击",
    shortTitle: "火锅店动感广告",
    type: "video",
    industry: "food",
    industryLabel: "餐饮美食",
    style: "dynamic",
    styleLabel: "动感潮流",
    description:
      "为连锁火锅品牌制作的抖音投流素材，食材翻滚+辣椒爆香的高能画面带动到店客流提升40%。",
    scenario: "抖音本地生活投流、大众点评顶部视频",
    clientType: "连锁火锅品牌、加盟店",
    prompt:
      "12秒动感潮流风格的麻辣火锅广告视频。镜头：红油翻滚特写、食材入锅瞬间、涮煮起夹的连贯切换。光线：戏剧性侧光突出蒸汽。色彩：红金撞色。节奏：急促踩点。",
    highlights: ["红油翻滚物理感", "蒸汽弥漫层次", "节奏踩点精准"],
    deliverables: ["竖屏主视频", "前3秒hook剪辑版"],
    duration: "12秒",
    resolution: "1080P",
    processingTime: "8小时",
    price: "499元",
    color: "from-red-500/30 to-orange-500/30",
    publishedAt: "2026-04-01",
  },

  // ========== 美妆护肤（2条） ==========
  {
    slug: "beauty-lipstick-dreamy",
    title: "口红产品梦幻广告视频 | 美妆品牌上新素材",
    shortTitle: "口红梦幻广告",
    type: "video",
    industry: "beauty",
    industryLabel: "美妆护肤",
    style: "luxurious",
    styleLabel: "高级奢华",
    description:
      "为国产美妆品牌新色号上市制作的产品广告，梦幻滤镜+膏体特写构建高级感知。",
    scenario: "小红书新品种草、天猫首页广告位",
    clientType: "国货美妆、彩妆新锐品牌",
    prompt:
      "12秒高级奢华风格的口红产品广告。镜头：口红缓慢旋出的特写、膏体质地的超微距、模特涂抹的唇部特写。光线：梦幻粉光柔光箱。色彩：深黑金色调。场景：大理石化妆台。情绪：尊贵令人向往。",
    highlights: ["膏体质地细节", "梦幻氛围构建", "唇部轮廓一致性"],
    deliverables: ["主视频", "单色号演绎版 × 3条"],
    duration: "12秒",
    resolution: "4K",
    processingTime: "14小时",
    price: "1099元",
    color: "from-pink-500/30 to-red-400/30",
    publishedAt: "2026-04-11",
  },
  {
    slug: "beauty-mask-fresh",
    title: "面膜产品清新广告 | 补水保湿卖点演绎",
    shortTitle: "面膜清新广告",
    type: "video",
    industry: "beauty",
    industryLabel: "美妆护肤",
    style: "fresh",
    styleLabel: "清新",
    description:
      "为补水面膜制作的演绎视频，水珠飞溅特效+模特敷贴镜头的组合提升卖点可信度。",
    scenario: "小红书投流、抖音品牌号",
    clientType: "护肤品牌、功效型产品线",
    prompt:
      "10秒清新风格的补水面膜广告。镜头：水滴溅落模特面部的慢镜头、面膜精华滴落的特写、敷面膜侧脸。光线：明亮通透。色彩：薄荷绿淡蓝。场景：浴室大理石。情绪：活力愉悦。",
    highlights: ["水珠物理真实", "肌肤质感AI优化", "清凉感视觉传达"],
    deliverables: ["主视频", "配套3张GIF"],
    duration: "10秒",
    resolution: "1080P",
    processingTime: "8小时",
    price: "599元",
    color: "from-cyan-400/20 to-blue-300/20",
    publishedAt: "2026-04-04",
  },

  // ========== 婚礼浪漫（2条） ==========
  {
    slug: "wedding-invitation-cinematic",
    title: "婚礼电子请柬视频 | 电影感浪漫邀约",
    shortTitle: "婚礼电子请柬",
    type: "video",
    industry: "wedding",
    industryLabel: "婚礼浪漫",
    style: "cinematic",
    styleLabel: "电影感",
    description:
      "为新人定制的电子婚礼请柬视频，融合新人照片+场景化镜头，替代传统纸质请柬发送至微信好友。",
    scenario: "微信群邀请、朋友圈转发、婚礼开场背景",
    clientType: "准新人、婚庆策划工作室",
    prompt:
      "20秒电影感风格的婚礼电子请柬视频。镜头：新人手牵手在花田走过的全景、戒指特写、婚礼日期浮现。光线：黄昏金色魔法光。色彩：青橙浪漫。场景：户外花田与教堂。情绪：庄重浪漫。",
    highlights: ["新人面部一致性保持", "黄昏光线戏剧化", "日期字幕优雅叠加"],
    deliverables: ["主视频（含定制日期地点）", "15秒朋友圈版"],
    duration: "20秒",
    resolution: "1080P",
    processingTime: "14小时",
    price: "999元",
    color: "from-rose-400/30 to-pink-500/30",
    publishedAt: "2026-04-13",
    featured: true,
  },
  {
    slug: "wedding-proposal-sweet",
    title: "求婚纪念短片 | 温馨定格爱的瞬间",
    shortTitle: "求婚纪念短片",
    type: "video",
    industry: "wedding",
    industryLabel: "婚礼浪漫",
    style: "warm",
    styleLabel: "温馨",
    description:
      "为求婚仪式制作的纪念视频，从初识到求婚的关键瞬间浪漫串联。",
    scenario: "求婚仪式播放、纪念日分享、朋友圈永久珍藏",
    clientType: "情侣、求婚策划服务",
    prompt:
      "25秒温馨风格的求婚纪念短片。镜头：咖啡馆初遇、海边牵手、戒指打开的特写、相拥瞬间的定格。光线：温暖室内灯光与晨光交织。色彩：奶茶暖色。情绪：亲切治愈。",
    highlights: ["多场景情绪串联", "人物一致性", "定制化文字"],
    deliverables: ["主短片", "高清截图 × 5张"],
    duration: "25秒",
    resolution: "1080P",
    processingTime: "16小时",
    price: "1299元",
    color: "from-amber-400/30 to-rose-400/30",
    publishedAt: "2026-04-06",
  },

  // ========== 科技产品（2条） ==========
  {
    slug: "tech-smartphone-launch",
    title: "智能手机新品发布视频 | 未来科技风产品发布",
    shortTitle: "智能手机发布",
    type: "video",
    industry: "tech",
    industryLabel: "科技产品",
    style: "futuristic",
    styleLabel: "未来科技",
    description:
      "为创业公司智能手机新品发布制作的宣传视频，粒子特效+数据可视化打造发布会级品质。",
    scenario: "产品发布会主视觉、官网首页、融资路演",
    clientType: "科技创业公司、数码品牌",
    prompt:
      "30秒未来科技风格的智能手机新品发布视频。镜头：手机从数字粒子中浮现、分解展示内部芯片、UI流畅切换、发布Logo爆裂呈现。光线：冷蓝基调配合霓虹粉点缀。色彩：高对比硬光。情绪：前沿酷炫。",
    highlights: ["粒子聚合特效", "芯片内部AI合成", "UI动效流畅"],
    deliverables: ["主发布视频", "官网Hero视频", "社交媒体短版"],
    duration: "30秒",
    resolution: "4K",
    processingTime: "24小时",
    price: "2999元",
    color: "from-indigo-500/30 to-blue-600/30",
    publishedAt: "2026-04-15",
  },
  {
    slug: "tech-saas-onboarding",
    title: "SaaS产品引导视频 | 功能演示官网首屏",
    shortTitle: "SaaS引导视频",
    type: "video",
    industry: "tech",
    industryLabel: "科技产品",
    style: "minimalist",
    styleLabel: "极简",
    description:
      "为B2B SaaS产品制作的功能引导视频，极简白底+UI动效完整呈现产品核心价值。",
    scenario: "SaaS官网首屏、产品介绍页、销售演示",
    clientType: "B2B SaaS创业公司、企服产品",
    prompt:
      "20秒极简风格的SaaS产品功能演示视频。镜头：产品界面从白色留白背景浮现，关键功能模块轮番特写，数据图表动态更新。光线：柔和均匀。色彩：白底配品牌主色。情绪：纯净专业。",
    highlights: ["UI动效真实还原", "数据可视化流畅", "品牌色系统一"],
    deliverables: ["官网版", "销售演示版", "X（Twitter）短版"],
    duration: "20秒",
    resolution: "1080P",
    processingTime: "16小时",
    price: "1499元",
    color: "from-slate-400/20 to-gray-400/20",
    publishedAt: "2026-04-08",
  },

  // ========== 教育培训（2条） ==========
  {
    slug: "education-kids-coding-warm",
    title: "少儿编程课程宣传视频 | 招生引流素材",
    shortTitle: "少儿编程宣传",
    type: "video",
    industry: "education",
    industryLabel: "教育培训",
    style: "warm",
    styleLabel: "温馨",
    description:
      "为少儿编程机构制作的试听课引流视频，儿童专注学习的温馨画面精准触达家长决策心理。",
    scenario: "朋友圈投流、公众号推送、家长群分享",
    clientType: "少儿编程机构、STEM教育品牌",
    prompt:
      "20秒温馨风格的少儿编程课程宣传视频。镜头：孩子盯着屏幕专注的特写、代码在屏幕流动、老师微笑引导、完成作品欢呼。光线：明亮自然光。色彩：暖色奶茶调。情绪：亲切治愈。",
    highlights: ["儿童表情自然真实", "场景温馨可信", "家长情感共鸣"],
    deliverables: ["主视频", "家长朋友圈版（15秒）"],
    duration: "20秒",
    resolution: "1080P",
    processingTime: "14小时",
    price: "899元",
    color: "from-yellow-400/20 to-orange-400/20",
    publishedAt: "2026-04-02",
  },
  {
    slug: "education-online-course-fresh",
    title: "在线课程招生视频 | 青年成人学习赛道",
    shortTitle: "在线课程招生",
    type: "video",
    industry: "education",
    industryLabel: "教育培训",
    style: "fresh",
    styleLabel: "清新",
    description:
      "为知识付费平台制作的课程招生视频，励志风格精准吸引职场进阶学员。",
    scenario: "小红书种草、B站贴片、公众号推送",
    clientType: "知识付费平台、成人教育机构",
    prompt:
      "15秒清新风格的在线课程招生视频。镜头：年轻人咖啡馆专注学习、平板上的课程界面、充满活力的通勤画面。光线：明亮通透。色彩：活力蓝绿。情绪：励志年轻。",
    highlights: ["年轻化视觉语言", "学习场景生活化", "励志情绪自然"],
    deliverables: ["主视频", "信息流版"],
    duration: "15秒",
    resolution: "1080P",
    processingTime: "10小时",
    price: "699元",
    color: "from-sky-400/20 to-blue-500/20",
    publishedAt: "2026-04-05",
  },

  // ========== 健身运动（2条） ==========
  {
    slug: "fitness-gym-promotion",
    title: "健身房年卡推广视频 | 动感入会招生",
    shortTitle: "健身房年卡推广",
    type: "video",
    industry: "fitness",
    industryLabel: "健身运动",
    style: "dynamic",
    styleLabel: "动感潮流",
    description:
      "为连锁健身房年卡推广制作的宣传视频，力量感与汗水的视觉冲击驱动入会决策。",
    scenario: "抖音本地投流、健身房门店大屏、小红书",
    clientType: "连锁健身房、私教工作室",
    prompt:
      "18秒动感潮流风格的健身房宣传视频。镜头：举铁慢镜头、汗水飞溅特写、器械训练连贯切换、完成训练击掌。光线：戏剧性侧逆光勾勒肌肉。色彩：高饱和撞色。节奏：急促踩点。",
    highlights: ["肌肉线条AI精准", "汗水飞溅视觉冲击", "节奏与BPM同步"],
    deliverables: ["主视频", "前3秒hook版"],
    duration: "18秒",
    resolution: "1080P",
    processingTime: "12小时",
    price: "999元",
    color: "from-red-500/30 to-yellow-500/30",
    publishedAt: "2026-04-10",
  },
  {
    slug: "fitness-yoga-cinematic",
    title: "瑜伽馆品牌宣传片 | 电影感身心疗愈",
    shortTitle: "瑜伽馆品牌片",
    type: "video",
    industry: "fitness",
    industryLabel: "健身运动",
    style: "cinematic",
    styleLabel: "电影感",
    description:
      "为高端瑜伽馆制作的品牌宣传视频，晨光下的瑜伽练习画面传递身心合一的品牌哲学。",
    scenario: "品牌官网、高端会员招募、会所展示",
    clientType: "高端瑜伽馆、身心疗愈品牌",
    prompt:
      "25秒电影感风格的瑜伽馆品牌宣传视频。镜头：晨光穿过落地窗的瑜伽室全景、学员倒立完美姿态、老师指导柔和特写。光线：晨光透过窗户的魔法时刻。色彩：青橙电影调。情绪：庄重沉浸。",
    highlights: ["晨光光束效果", "身体姿态一致性", "禅意氛围"],
    deliverables: ["主宣传片", "15秒社交媒体版"],
    duration: "25秒",
    resolution: "4K",
    processingTime: "20小时",
    price: "1999元",
    color: "from-amber-300/20 to-orange-400/20",
    publishedAt: "2026-04-13",
  },
];

// ============================================================
// 查询工具函数
// ============================================================

export function getShowcase(slug: string): Showcase | undefined {
  return SHOWCASES.find((s) => s.slug === slug);
}

export function getAllShowcases(): Showcase[] {
  return [...SHOWCASES].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getFeaturedShowcases(): Showcase[] {
  return SHOWCASES.filter((s) => s.featured);
}

export function getShowcasesByIndustry(industry: string): Showcase[] {
  return SHOWCASES.filter((s) => s.industry === industry);
}

export function getRelatedShowcases(
  current: Showcase,
  limit = 3
): Showcase[] {
  return SHOWCASES.filter(
    (s) =>
      s.slug !== current.slug &&
      (s.industry === current.industry || s.style === current.style)
  ).slice(0, limit);
}

export function getAllIndustries(): { value: string; label: string; count: number }[] {
  const map = new Map<string, { label: string; count: number }>();
  for (const s of SHOWCASES) {
    const entry = map.get(s.industry);
    if (entry) {
      entry.count++;
    } else {
      map.set(s.industry, { label: s.industryLabel, count: 1 });
    }
  }
  return Array.from(map.entries()).map(([value, { label, count }]) => ({
    value,
    label,
    count,
  }));
}
