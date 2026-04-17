import { ImageResponse } from "next/og";

export const runtime = "nodejs";

// 闲鱼商品主图最佳规格：1080×1080 正方形
const SIZE = { width: 1080, height: 1080 };

type Variant =
  | "cover-standard" // 主图 - 标准版29.9元
  | "cover-pro" // 主图 - Pro版99元
  | "cover-industry" // 主图 - 行业细分版19.9元
  | "feature-industries" // 副图 - 16行业展示
  | "feature-comparison" // 副图 - 成本对比
  | "feature-sample" // 副图 - 样例提示词
  | "feature-formats" // 副图 - 文件格式
  | "feature-steps" // 副图 - 3步使用
  | "feature-value" // 副图 - 价值计算
  | "feature-testimonial" // 副图 - 客户见证
  | "feature-urgency"; // 副图 - 限时紧迫感

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ variant: string }> }
) {
  const { variant } = await params;
  const v = variant as Variant;

  switch (v) {
    case "cover-standard":
      return coverStandard();
    case "cover-pro":
      return coverPro();
    case "cover-industry":
      return coverIndustry();
    case "feature-industries":
      return featureIndustries();
    case "feature-comparison":
      return featureComparison();
    case "feature-sample":
      return featureSample();
    case "feature-formats":
      return featureFormats();
    case "feature-steps":
      return featureSteps();
    case "feature-value":
      return featureValue();
    case "feature-testimonial":
      return featureTestimonial();
    case "feature-urgency":
      return featureUrgency();
    default:
      return new Response("Unknown variant", { status: 404 });
  }
}

// ============================================================
// 主图 1: 标准版（主力商品）
// ============================================================
function coverStandard() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #1a0033 0%, #0f0c29 50%, #302b63 100%)",
          padding: "80px",
          position: "relative",
          fontFamily: "system-ui",
        }}
      >
        {/* 装饰性光晕 */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: "-200px",
            right: "-200px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(168,85,247,0.4), transparent)",
          }}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: "-150px",
            left: "-150px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.3), transparent)",
          }}
        />

        {/* 顶部标签 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "10px 24px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.1)",
              border: "2px solid rgba(255,255,255,0.3)",
              color: "white",
              fontSize: "24px",
              fontWeight: 600,
            }}
          >
            商业授权 · 永久更新
          </div>
        </div>

        {/* 大数字 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "20px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "280px",
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-8px",
              background:
                "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #dc2626 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            3072
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "44px",
              fontWeight: 700,
              color: "#fde68a",
              marginTop: "-20px",
            }}
          >
            条商业级AI提示词
          </div>
        </div>

        {/* 主标题 */}
        <div
          style={{
            display: "flex",
            fontSize: "72px",
            fontWeight: 800,
            color: "white",
            lineHeight: 1.1,
            marginBottom: "24px",
          }}
        >
          AI视频提示词宝典
        </div>

        {/* 卖点列表 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginBottom: "auto",
          }}
        >
          <Bullet text="16大商业行业全覆盖" />
          <Bullet text="12种视觉风格系统分类" />
          <Bullet text="JSON+Excel+PDF三种格式" />
          <Bullet text="Wan/Sora/Runway通用" />
        </div>

        {/* 底部价格区 */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            paddingTop: "30px",
            borderTop: "2px solid rgba(255,255,255,0.2)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                color: "#9ca3af",
                fontSize: "24px",
                textDecoration: "line-through",
              }}
            >
              原价 ¥99
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "8px",
                marginTop: "4px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  color: "#fbbf24",
                  fontSize: "36px",
                  fontWeight: 700,
                }}
              >
                ¥
              </div>
              <div
                style={{
                  display: "flex",
                  color: "#fbbf24",
                  fontSize: "96px",
                  fontWeight: 900,
                  lineHeight: 1,
                }}
              >
                29.9
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <div
              style={{
                display: "flex",
                padding: "8px 20px",
                borderRadius: "8px",
                background: "#dc2626",
                color: "white",
                fontSize: "28px",
                fontWeight: 700,
              }}
            >
              限时特惠
            </div>
            <div
              style={{
                display: "flex",
                color: "#9ca3af",
                fontSize: "20px",
                marginTop: "8px",
              }}
            >
              自动发货 · 永久有效
            </div>
          </div>
        </div>
      </div>
    ),
    { ...SIZE }
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          background: "#10b981",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "24px",
          fontWeight: 700,
        }}
      >
        ✓
      </div>
      <div
        style={{
          display: "flex",
          color: "white",
          fontSize: "36px",
          fontWeight: 500,
        }}
      >
        {text}
      </div>
    </div>
  );
}

// ============================================================
// 主图 2: Pro版
// ============================================================
function coverPro() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #0c0a1f 0%, #0f172a 50%, #1e1b4b 100%)",
          padding: "80px",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            right: 0,
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(251,191,36,0.3), transparent)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "60px",
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "12px 32px",
              borderRadius: "999px",
              background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
              color: "#1a0033",
              fontSize: "28px",
              fontWeight: 800,
            }}
          >
            ★ PRO 专业版
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "96px",
            fontWeight: 900,
            color: "white",
            lineHeight: 1.1,
            marginBottom: "20px",
          }}
        >
          AI视频提示词宝典
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "48px",
            fontWeight: 700,
            color: "#fbbf24",
            marginBottom: "60px",
          }}
        >
          PRO 批量变现加强版
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            marginBottom: "auto",
          }}
        >
          <ProBullet number="01" text="3072条全行业提示词" />
          <ProBullet number="02" text="ComfyUI批量工作流JSON" />
          <ProBullet number="03" text="1v1远程配置指导30分钟" />
          <ProBullet number="04" text="终身更新永久免费" />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            paddingTop: "30px",
            borderTop: "2px solid rgba(251,191,36,0.3)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                color: "#9ca3af",
                fontSize: "24px",
              }}
            >
              升级Pro享完整方案
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "8px",
                marginTop: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  color: "#fbbf24",
                  fontSize: "36px",
                  fontWeight: 700,
                }}
              >
                ¥
              </div>
              <div
                style={{
                  display: "flex",
                  color: "#fbbf24",
                  fontSize: "108px",
                  fontWeight: 900,
                  lineHeight: 1,
                }}
              >
                99
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              padding: "16px 32px",
              borderRadius: "12px",
              background: "rgba(251,191,36,0.15)",
              border: "2px solid #fbbf24",
              color: "#fde68a",
              fontSize: "28px",
              fontWeight: 600,
            }}
          >
            专业变现首选
          </div>
        </div>
      </div>
    ),
    { ...SIZE }
  );
}

function ProBullet({ number, text }: { number: string; text: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "80px",
          height: "80px",
          borderRadius: "20px",
          background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
          alignItems: "center",
          justifyContent: "center",
          color: "#1a0033",
          fontSize: "36px",
          fontWeight: 900,
        }}
      >
        {number}
      </div>
      <div
        style={{
          display: "flex",
          color: "white",
          fontSize: "44px",
          fontWeight: 600,
        }}
      >
        {text}
      </div>
    </div>
  );
}

// ============================================================
// 主图 3: 行业细分版
// ============================================================
function coverIndustry() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#fef3c7",
          padding: "80px",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            padding: "12px 28px",
            borderRadius: "999px",
            background: "#dc2626",
            color: "white",
            fontSize: "28px",
            fontWeight: 700,
            alignSelf: "flex-start",
            marginBottom: "40px",
          }}
        >
          行业专用 · 19.9元特价
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "120px",
            fontWeight: 900,
            color: "#7c2d12",
            lineHeight: 1,
            marginBottom: "20px",
          }}
        >
          192条
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "54px",
            fontWeight: 700,
            color: "#9a3412",
            marginBottom: "60px",
          }}
        >
          [行业名] AI视频提示词
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginBottom: "auto",
            padding: "40px",
            background: "white",
            borderRadius: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "32px",
              fontWeight: 700,
              color: "#7c2d12",
            }}
          >
            单一行业深度内容：
          </div>
          <div style={{ display: "flex", fontSize: "28px", color: "#78350f" }}>
            · 12种视觉风格
          </div>
          <div style={{ display: "flex", fontSize: "28px", color: "#78350f" }}>
            · 4种核心产品形态
          </div>
          <div style={{ display: "flex", fontSize: "28px", color: "#78350f" }}>
            · 2种时长变体
          </div>
          <div style={{ display: "flex", fontSize: "28px", color: "#78350f" }}>
            · 3种镜头变体
          </div>
          <div style={{ display: "flex", fontSize: "28px", color: "#78350f" }}>
            · 全部含商用授权
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "40px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                color: "#9a3412",
                fontSize: "28px",
                fontWeight: 600,
              }}
            >
              升级全版本仅需补差价
            </div>
            <div
              style={{
                display: "flex",
                color: "#dc2626",
                fontSize: "32px",
                fontWeight: 700,
                marginTop: "4px",
              }}
            >
              29.9元 → 3072条全行业
            </div>
          </div>
          <div
            style={{
              display: "flex",
              color: "#dc2626",
              fontSize: "140px",
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            ¥19
            <div
              style={{
                display: "flex",
                fontSize: "56px",
                alignSelf: "flex-start",
              }}
            >
              .9
            </div>
          </div>
        </div>
      </div>
    ),
    { ...SIZE }
  );
}

// ============================================================
// 副图 1: 16个行业展示
// ============================================================
function featureIndustries() {
  const industries = [
    "电商产品",
    "房产楼盘",
    "餐饮美食",
    "美妆护肤",
    "婚礼浪漫",
    "科技产品",
    "教育培训",
    "健身运动",
    "汽车展示",
    "旅游景点",
    "母婴亲子",
    "宠物用品",
    "金融服务",
    "医疗健康",
    "服装时尚",
    "游戏电竞",
  ];
  const colors = [
    "#fbbf24",
    "#3b82f6",
    "#ef4444",
    "#ec4899",
    "#f43f5e",
    "#6366f1",
    "#eab308",
    "#dc2626",
    "#06b6d4",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#64748b",
    "#14b8a6",
    "#d946ef",
    "#84cc16",
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#030712",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "48px",
            fontWeight: 800,
            color: "white",
            marginBottom: "20px",
          }}
        >
          16大商业行业全覆盖
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "28px",
            color: "#9ca3af",
            marginBottom: "50px",
          }}
        >
          每个行业 192 条深度内容，总计 3072 条
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "auto",
          }}
        >
          {industries.map((ind, i) => (
            <div
              key={ind}
              style={{
                display: "flex",
                width: "220px",
                height: "130px",
                borderRadius: "20px",
                background: `${colors[i]}22`,
                border: `2px solid ${colors[i]}`,
                alignItems: "center",
                justifyContent: "center",
                color: colors[i],
                fontSize: "32px",
                fontWeight: 700,
              }}
            >
              {ind}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "40px",
            padding: "24px",
            background: "rgba(251,191,36,0.15)",
            borderRadius: "16px",
            border: "2px solid #fbbf24",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#fde68a",
              fontSize: "32px",
              fontWeight: 700,
            }}
          >
            你做什么行业，我们都有现成模板
          </div>
        </div>
      </div>
    ),
    { ...SIZE }
  );
}

// ============================================================
// 副图 2: 成本对比
// ============================================================
function featureComparison() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "white",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "52px",
            fontWeight: 900,
            color: "#111827",
            marginBottom: "20px",
          }}
        >
          传统制作 vs AI生成
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "28px",
            color: "#6b7280",
            marginBottom: "60px",
          }}
        >
          同样一条 15秒 产品视频
        </div>

        <div style={{ display: "flex", gap: "24px", flex: 1 }}>
          {/* 传统方式 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              padding: "40px",
              background: "#fef2f2",
              borderRadius: "24px",
              border: "3px solid #fecaca",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: "32px",
                fontWeight: 700,
                color: "#991b1b",
                marginBottom: "30px",
              }}
            >
              ❌ 传统外包
            </div>
            <CompRow label="时间" value="3-7天" neg />
            <CompRow label="拍摄费" value="¥3000+" neg />
            <CompRow label="场地费" value="¥500+" neg />
            <CompRow label="剪辑费" value="¥1000+" neg />
            <CompRow label="改稿费" value="¥500×N" neg />
            <div
              style={{
                display: "flex",
                marginTop: "auto",
                paddingTop: "20px",
                borderTop: "2px dashed #fecaca",
                fontSize: "48px",
                fontWeight: 900,
                color: "#dc2626",
              }}
            >
              ¥5000+
            </div>
          </div>

          {/* AI方式 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              padding: "40px",
              background: "#f0fdf4",
              borderRadius: "24px",
              border: "3px solid #86efac",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: "32px",
                fontWeight: 700,
                color: "#166534",
                marginBottom: "30px",
              }}
            >
              ✓ AI+本宝典
            </div>
            <CompRow label="时间" value="5-10分钟" />
            <CompRow label="设备" value="已有" />
            <CompRow label="电费" value="¥0.5" />
            <CompRow label="模板费" value="¥29.9（一次性）" />
            <CompRow label="无限修改" value="免费" />
            <div
              style={{
                display: "flex",
                marginTop: "auto",
                paddingTop: "20px",
                borderTop: "2px dashed #86efac",
                fontSize: "48px",
                fontWeight: 900,
                color: "#16a34a",
              }}
            >
              ¥0.5
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "40px",
            padding: "24px",
            background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
            borderRadius: "16px",
            color: "white",
            fontSize: "36px",
            fontWeight: 800,
          }}
        >
          省下的第1条视频钱 = 买100份这个宝典
        </div>
      </div>
    ),
    { ...SIZE }
  );
}

function CompRow({
  label,
  value,
  neg,
}: {
  label: string;
  value: string;
  neg?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: "26px",
          color: neg ? "#7f1d1d" : "#14532d",
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: "28px",
          fontWeight: 700,
          color: neg ? "#dc2626" : "#16a34a",
        }}
      >
        {value}
      </div>
    </div>
  );
}

// ============================================================
// 副图 3: 样例提示词
// ============================================================
function featureSample() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0f172a",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "44px",
            fontWeight: 800,
            color: "white",
            marginBottom: "20px",
          }}
        >
          每一条都是商业级专业模板
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "26px",
            color: "#9ca3af",
            marginBottom: "40px",
          }}
        >
          以下是宝典中的真实案例（节选）
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "36px",
            background: "#1e293b",
            borderRadius: "16px",
            border: "2px solid #334155",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "24px",
              color: "#10b981",
              marginBottom: "16px",
              fontFamily: "monospace",
            }}
          >
            # P00023 · 电商产品 · 高级奢华风
          </div>
          <div
            style={{
              display: "flex",
              color: "#e5e7eb",
              fontSize: "22px",
              fontFamily: "monospace",
              lineHeight: 1.6,
            }}
          >
            15秒高级奢华风格的轻奢陶瓷马克杯商业视频。镜头：360度环绕特写，浅景深，电影级色彩分级。光线：柔和演播室顶光配合金色侧逆光。色彩：深黑金色调。场景：大理石台面配咖啡豆。情绪：尊贵精致。
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "36px",
            background: "#1e293b",
            borderRadius: "16px",
            border: "2px solid #334155",
            marginBottom: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "24px",
              color: "#3b82f6",
              marginBottom: "16px",
              fontFamily: "monospace",
            }}
          >
            # P00457 · 房产楼盘 · 电影感风
          </div>
          <div
            style={{
              display: "flex",
              color: "#e5e7eb",
              fontSize: "22px",
              fontFamily: "monospace",
              lineHeight: 1.6,
            }}
          >
            30秒电影感的海景别墅宣传视频。镜头：无人机从高空俯冲至前门，穿越大堂至客厅落地窗。光线：黄昏金色时刻。色彩：青橙电影分级。情绪：奢华向往。节奏：富有张力。
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "32px",
            padding: "20px",
            background: "rgba(16,185,129,0.15)",
            borderRadius: "12px",
            border: "2px solid #10b981",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#6ee7b7",
              fontSize: "28px",
              fontWeight: 700,
            }}
          >
            还有 3070 条等你解锁
          </div>
        </div>
      </div>
    ),
    { ...SIZE }
  );
}

// ============================================================
// 副图 4: 文件格式
// ============================================================
function featureFormats() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#fafafa",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "52px",
            fontWeight: 900,
            color: "#111827",
            marginBottom: "60px",
          }}
        >
          三种格式，按需使用
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <FormatCard
            icon="📊"
            name="Excel (CSV)"
            desc="双击打开，按行业筛选，复制粘贴一气呵成"
            best="适合："
            bestTarget="电商运营 / 营销策划 / 普通用户"
            color="#10b981"
          />
          <FormatCard
            icon="📄"
            name="PDF / Markdown"
            desc="精美排版阅读版，手机电脑都能看，适合学习"
            best="适合："
            bestTarget="新手入门 / 碎片化阅读"
            color="#3b82f6"
          />
          <FormatCard
            icon="💻"
            name="JSON 数据"
            desc="结构化数据，可导入你的SaaS / 自动化系统"
            best="适合："
            bestTarget="开发者 / 工具集成 / 技术团队"
            color="#a855f7"
          />
        </div>
      </div>
    ),
    { ...SIZE }
  );
}

function FormatCard({
  icon,
  name,
  desc,
  best,
  bestTarget,
  color,
}: {
  icon: string;
  name: string;
  desc: string;
  best: string;
  bestTarget: string;
  color: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "30px",
        padding: "32px",
        background: "white",
        borderRadius: "20px",
        borderLeft: `8px solid ${color}`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: "80px",
        }}
      >
        {icon}
      </div>
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div
          style={{
            display: "flex",
            fontSize: "36px",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "8px",
          }}
        >
          {name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "22px",
            color: "#4b5563",
            marginBottom: "8px",
          }}
        >
          {desc}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "20px",
            color,
            fontWeight: 600,
          }}
        >
          {best}
          {bestTarget}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 副图 5: 三步使用
// ============================================================
function featureSteps() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #fef3c7 0%, #fed7aa 50%, #fbbf24 100%)",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "52px",
            fontWeight: 900,
            color: "#7c2d12",
            marginBottom: "10px",
          }}
        >
          3步搞定，小白也会
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "28px",
            color: "#9a3412",
            marginBottom: "60px",
          }}
        >
          从购买到出片，平均用时 10 分钟
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            marginBottom: "auto",
          }}
        >
          <StepCard
            num="1"
            title="打开Excel"
            desc="用Excel打开 prompts.csv，按你的行业筛选"
          />
          <StepCard
            num="2"
            title="复制提示词"
            desc="找到你喜欢的风格和场景，复制那一行的提示词"
          />
          <StepCard
            num="3"
            title="粘贴到AI工具"
            desc="Wan 2.2 / Sora / Runway / 可灵 / Pika 通用"
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "40px",
            padding: "24px",
            background: "rgba(124,45,18,0.1)",
            borderRadius: "16px",
            border: "3px solid #7c2d12",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#7c2d12",
              fontSize: "32px",
              fontWeight: 700,
            }}
          >
            不用学、不用写、不用想 —— 复制粘贴即可
          </div>
        </div>
      </div>
    ),
    { ...SIZE }
  );
}

function StepCard({
  num,
  title,
  desc,
}: {
  num: string;
  title: string;
  desc: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "30px",
        padding: "28px",
        background: "white",
        borderRadius: "20px",
        boxShadow: "0 8px 24px rgba(124,45,18,0.15)",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100px",
          height: "100px",
          borderRadius: "24px",
          background: "linear-gradient(135deg, #dc2626, #ea580c)",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "64px",
          fontWeight: 900,
        }}
      >
        {num}
      </div>
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div
          style={{
            display: "flex",
            fontSize: "36px",
            fontWeight: 800,
            color: "#7c2d12",
            marginBottom: "8px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "24px",
            color: "#9a3412",
          }}
        >
          {desc}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 副图 6: 价值计算
// ============================================================
function featureValue() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#030712",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "48px",
            fontWeight: 900,
            color: "white",
            marginBottom: "20px",
          }}
        >
          这 ¥29.9 到底值多少？
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "26px",
            color: "#9ca3af",
            marginBottom: "50px",
          }}
        >
          按市场价折算每一条单价，结论很可怕
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginBottom: "auto",
          }}
        >
          <ValueRow
            label="3072 条提示词"
            value="× ¥10/条市场价"
            result="¥30,720"
          />
          <ValueRow label="16 个行业完整覆盖" value="× 单行业 ¥200" result="¥3,200" />
          <ValueRow
            label="商用授权"
            value="× 单次交付折算"
            result="¥5,000+"
          />
          <ValueRow label="终身更新" value="× 每年更新价值" result="¥500/年" />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "40px",
            padding: "32px",
            background:
              "linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.2))",
            borderRadius: "20px",
            border: "3px solid #fbbf24",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                color: "#fde68a",
                fontSize: "28px",
                fontWeight: 600,
              }}
            >
              市场总价值：
            </div>
            <div
              style={{
                display: "flex",
                color: "#fbbf24",
                fontSize: "64px",
                fontWeight: 900,
              }}
            >
              ¥39,420+
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "20px",
              paddingTop: "20px",
              borderTop: "2px dashed #fbbf24",
            }}
          >
            <div
              style={{
                display: "flex",
                color: "white",
                fontSize: "32px",
                fontWeight: 700,
              }}
            >
              你实际支付：
            </div>
            <div
              style={{
                display: "flex",
                color: "#10b981",
                fontSize: "80px",
                fontWeight: 900,
              }}
            >
              ¥29.9
            </div>
          </div>
        </div>
      </div>
    ),
    { ...SIZE }
  );
}

function ValueRow({
  label,
  value,
  result,
}: {
  label: string;
  value: string;
  result: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "24px 28px",
        background: "#1e293b",
        borderRadius: "16px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div
          style={{
            display: "flex",
            color: "white",
            fontSize: "28px",
            fontWeight: 600,
          }}
        >
          {label}
        </div>
        <div
          style={{
            display: "flex",
            color: "#9ca3af",
            fontSize: "22px",
            marginTop: "4px",
          }}
        >
          {value}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          color: "#fbbf24",
          fontSize: "36px",
          fontWeight: 800,
        }}
      >
        {result}
      </div>
    </div>
  );
}

// ============================================================
// 副图 7: 客户见证（即将上线，暂空出）
// ============================================================
function featureTestimonial() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#fafafa",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "48px",
            fontWeight: 900,
            color: "#111827",
            marginBottom: "40px",
          }}
        >
          已经用上的人都说啥
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <Testimonial
            name="王老板"
            role="天猫卖家 · 上海"
            text="开了3年店，从来没想到做个视频能这么简单。一天出10条，ROI暴涨。"
            color="#3b82f6"
          />
          <Testimonial
            name="李同学"
            role="MCN视频剪辑师 · 广州"
            text="公司接单成本直接减半，客户只知道我们交付快，不知道我们用了AI。"
            color="#ec4899"
          />
          <Testimonial
            name="张总"
            role="房产中介 · 三亚"
            text="给我的客户看了样板间AI视频，签约率提升了30%。"
            color="#10b981"
          />
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "auto",
            justifyContent: "center",
            padding: "24px",
            background: "#fef3c7",
            borderRadius: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#7c2d12",
              fontSize: "28px",
              fontWeight: 700,
            }}
          >
            ⭐⭐⭐⭐⭐ 已服务 100+ 用户
          </div>
        </div>
      </div>
    ),
    { ...SIZE }
  );
}

function Testimonial({
  name,
  role,
  text,
  color,
}: {
  name: string;
  role: string;
  text: string;
  color: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        padding: "28px",
        background: "white",
        borderRadius: "16px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "70px",
          height: "70px",
          borderRadius: "50%",
          background: color,
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "32px",
          fontWeight: 800,
        }}
      >
        {name[0]}
      </div>
      <div
        style={{ display: "flex", flexDirection: "column", flex: 1, gap: "6px" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "26px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {name}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "20px",
              color: "#6b7280",
            }}
          >
            {role}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "22px",
            color: "#374151",
            lineHeight: 1.5,
          }}
        >
          「{text}」
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 副图 8: 紧迫感
// ============================================================
function featureUrgency() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
          padding: "60px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            padding: "12px 32px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.2)",
            color: "white",
            fontSize: "32px",
            fontWeight: 700,
            marginBottom: "40px",
          }}
        >
          🔥 限时3天特价
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "72px",
            fontWeight: 900,
            color: "white",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: "40px",
          }}
        >
          错过今天
          <br />
          恢复原价 ¥99
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "40px",
            marginBottom: "60px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                color: "#fecaca",
                fontSize: "28px",
                textDecoration: "line-through",
              }}
            >
              原价
            </div>
            <div
              style={{
                display: "flex",
                color: "#fecaca",
                fontSize: "72px",
                fontWeight: 700,
                textDecoration: "line-through",
              }}
            >
              ¥99
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "80px",
              color: "white",
            }}
          >
            →
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                color: "#fef3c7",
                fontSize: "32px",
                fontWeight: 700,
              }}
            >
              现在
            </div>
            <div
              style={{
                display: "flex",
                color: "#fef3c7",
                fontSize: "160px",
                fontWeight: 900,
                lineHeight: 1,
              }}
            >
              29.9
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            padding: "20px 40px",
            background: "#fbbf24",
            borderRadius: "16px",
            color: "#7c2d12",
            fontSize: "36px",
            fontWeight: 900,
          }}
        >
          立即拍下 · 自动发货
        </div>
      </div>
    ),
    { ...SIZE }
  );
}
