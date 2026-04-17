import { NextRequest, NextResponse } from "next/server";
import {
  saveLead,
  validateLead,
  isRateLimited,
} from "@/lib/leadStorage";

export const runtime = "nodejs";

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const userAgent = req.headers.get("user-agent") || "unknown";

    // 限流
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: "提交过于频繁，请稍后再试" },
        { status: 429 }
      );
    }

    // 解析请求体
    const body = await req.json().catch(() => null);
    const validation = validateLead(body);
    if (!validation.ok || !validation.data) {
      return NextResponse.json(
        { ok: false, error: validation.error || "数据无效" },
        { status: 400 }
      );
    }

    const record = await saveLead(validation.data, { ip, userAgent });

    // 打印到日志（Vercel/Netlify等serverless环境文件系统只读，日志是主要保留方式）
    // 访问 Vercel Dashboard → 项目 → Logs 可以看到所有线索
    console.log(
      `🎯 [LEAD] ${new Date().toISOString()} | source=${record.source} | phone=${record.phone || "-"} | wechat=${record.wechat || "-"} | need=${record.need || "-"} | theme=${record.theme || "-"} | detail=${record.detail?.slice(0, 200) || "-"}`
    );

    return NextResponse.json({ ok: true, id: record.id });
  } catch (err) {
    console.error("[api/lead] error:", err);
    return NextResponse.json(
      { ok: false, error: "服务异常，请稍后重试" },
      { status: 500 }
    );
  }
}
