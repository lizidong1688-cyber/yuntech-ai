import { ImageResponse } from "next/og";
import { getShowcase, getAllShowcases } from "@/lib/showcases";

export const alt = "云创未来 AI案例";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return getAllShowcases().map((s) => ({ slug: s.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = getShowcase(slug);

  const title = s?.shortTitle || "AI商业案例";
  const industry = s?.industryLabel || "";
  const style = s?.styleLabel || "";
  const description = s?.description.slice(0, 80) || "";
  const price = s?.price || "";

  const colorMap: Record<string, [string, string]> = {
    ecommerce: ["#f59e0b", "#dc2626"],
    realestate: ["#3b82f6", "#06b6d4"],
    food: ["#ef4444", "#f59e0b"],
    beauty: ["#ec4899", "#f43f5e"],
    wedding: ["#f43f5e", "#ec4899"],
    tech: ["#6366f1", "#a855f7"],
    education: ["#eab308", "#f97316"],
    fitness: ["#ef4444", "#eab308"],
  };
  const [c1, c2] = colorMap[s?.industry || "tech"] || ["#6366f1", "#a855f7"];

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
          fontFamily: "system-ui",
          position: "relative",
        }}
      >
        {/* 装饰性光晕 */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: "-200px",
            right: "-200px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${c1}44, transparent)`,
          }}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: "-150px",
            left: "-150px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${c2}33, transparent)`,
          }}
        />

        {/* 品牌行 */}
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
              width: "56px",
              height: "56px",
              borderRadius: "12px",
              background: `linear-gradient(135deg, ${c1}, ${c2})`,
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "28px",
              fontWeight: 700,
            }}
          >
            云
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                color: "white",
                fontSize: "28px",
                fontWeight: 700,
              }}
            >
              云创未来
            </div>
            <div
              style={{
                display: "flex",
                color: "#818cf8",
                fontSize: "14px",
              }}
            >
              AI视频与图像生成服务
            </div>
          </div>
        </div>

        {/* 标签行 */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "8px 16px",
              borderRadius: "999px",
              background: `${c1}33`,
              color: c1,
              fontSize: "18px",
              fontWeight: 500,
            }}
          >
            {industry}
          </div>
          <div
            style={{
              display: "flex",
              padding: "8px 16px",
              borderRadius: "999px",
              background: "#1f2937",
              color: "#d1d5db",
              fontSize: "18px",
            }}
          >
            {style}
          </div>
        </div>

        {/* 主标题 */}
        <div
          style={{
            display: "flex",
            color: "white",
            fontSize: "64px",
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: "24px",
            maxWidth: "1000px",
          }}
        >
          {title}
        </div>

        {/* 描述 */}
        <div
          style={{
            display: "flex",
            color: "#9ca3af",
            fontSize: "22px",
            lineHeight: 1.5,
            maxWidth: "950px",
            marginBottom: "auto",
          }}
        >
          {description}
        </div>

        {/* 底部信息栏 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "40px",
            paddingTop: "24px",
            borderTop: "1px solid #374151",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#6b7280",
              fontSize: "20px",
            }}
          >
            yunchuangweilai.com · 海南自贸港企业
          </div>
          <div
            style={{
              display: "flex",
              color: c1,
              fontSize: "28px",
              fontWeight: 700,
            }}
          >
            {price ? `${price}起` : ""}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
