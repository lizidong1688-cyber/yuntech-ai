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

    // 开发环境打印日志，方便第一时间看到新线索
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `\n🎯 [新线索] ${new Date().toLocaleString("zh-CN")}\n` +
          `   来源：${record.source}\n` +
          `   手机：${record.phone || "-"}\n` +
          `   微信：${record.wechat || "-"}\n` +
          `   需求：${record.need || record.detail || record.theme || "-"}\n`
      );
    }

    return NextResponse.json({ ok: true, id: record.id });
  } catch (err) {
    console.error("[api/lead] error:", err);
    return NextResponse.json(
      { ok: false, error: "服务异常，请稍后重试" },
      { status: 500 }
    );
  }
}
