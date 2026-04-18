import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60; // 最多60秒

/**
 * AI图像生成代理
 *
 * 核心作用：
 * - 浏览器直连Pollinations会被User-Agent/Referer限流（429/403）
 * - 通过Vercel Serverless代理，出口是数据中心IP+纯净请求头，绕过限流
 * - 响应以image流返回，前端 <img src="/api/ai-image?prompt=xxx"> 直接可用
 *
 * 调用示例：
 *   /api/ai-image?prompt=red%20apple&width=512&height=512&seed=123
 */
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const prompt = sp.get("prompt");
    const width = Number(sp.get("width") || "1024");
    const height = Number(sp.get("height") || "576");
    const seed = Number(sp.get("seed") || Math.floor(Math.random() * 1000000));

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "缺少prompt参数" },
        { status: 400 }
      );
    }

    // 限制参数边界，防止滥用
    const w = Math.max(256, Math.min(2048, width));
    const h = Math.max(256, Math.min(2048, height));
    const s = Math.max(0, Math.min(9_999_999, seed));

    const targetUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${w}&height=${h}&seed=${s}&nologo=true`;

    // 重试3次
    let lastErr: string = "未知错误";
    for (let i = 0; i < 3; i++) {
      try {
        // 关键：故意不带User-Agent和Referer，让Pollinations把我们当高级客户端
        const res = await fetch(targetUrl, {
          signal: AbortSignal.timeout(45000),
          cache: "no-store",
        });

        if (res.status === 200) {
          const buf = await res.arrayBuffer();
          // 验证是图片（避免返回429 JSON）
          if (buf.byteLength < 5000) {
            lastErr = `响应过小，可能是错误：${buf.byteLength}B`;
            await sleep(1500 * (i + 1));
            continue;
          }

          return new NextResponse(new Uint8Array(buf), {
            status: 200,
            headers: {
              "Content-Type": "image/jpeg",
              "Cache-Control":
                "public, max-age=86400, s-maxage=86400, immutable",
              // CORS对同源请求可选，加上更稳
              "Access-Control-Allow-Origin": "*",
            },
          });
        }

        lastErr = `HTTP ${res.status}`;
        if (res.status === 429) {
          // 限流则退避
          await sleep(2000 * (i + 1));
          continue;
        }
        // 其他错误也重试
        await sleep(1500 * (i + 1));
      } catch (err) {
        lastErr = (err as Error).message || "网络错误";
        if (i < 2) {
          await sleep(1500 * (i + 1));
        }
      }
    }

    return NextResponse.json(
      { error: `AI生成失败：${lastErr}` },
      { status: 502 }
    );
  } catch (err) {
    console.error("[api/ai-image] error:", err);
    return NextResponse.json(
      { error: "服务异常" },
      { status: 500 }
    );
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
