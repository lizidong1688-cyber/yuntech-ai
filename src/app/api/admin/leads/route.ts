import { NextRequest, NextResponse } from "next/server";
import {
  listLeads,
  countLeads,
  updateLeadStatus,
  type LeadRecord,
} from "@/lib/leadStorage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 简易鉴权：从 Authorization: Bearer <token> 或 ?token= 读取
 * 与 ADMIN_TOKEN 环境变量比对
 *
 * 默认token：yuntech-admin-2026（生产请务必通过.env.local覆盖）
 */
function checkAuth(req: NextRequest): boolean {
  const expected = process.env.ADMIN_TOKEN || "yuntech-admin-2026";
  const auth = req.headers.get("authorization");
  const bearer = auth?.startsWith("Bearer ") ? auth.slice(7).trim() : null;
  const queryToken = req.nextUrl.searchParams.get("token");
  return bearer === expected || queryToken === expected;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json(
      { ok: false, error: "未授权" },
      { status: 401 }
    );
  }

  const source = req.nextUrl.searchParams.get("source") || undefined;
  const status = req.nextUrl.searchParams.get("status") || undefined;

  const [leads, stats] = await Promise.all([
    listLeads({
      source: source as never,
      status: status as never,
    }),
    countLeads(),
  ]);

  return NextResponse.json({ ok: true, leads, stats });
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json(
      { ok: false, error: "未授权" },
      { status: 401 }
    );
  }

  const body = (await req.json().catch(() => null)) as {
    id?: string;
    status?: LeadRecord["status"];
    note?: string;
  } | null;

  if (!body?.id || !body?.status) {
    return NextResponse.json(
      { ok: false, error: "缺少id或status" },
      { status: 400 }
    );
  }

  const updated = await updateLeadStatus(body.id, body.status, body.note);
  if (!updated) {
    return NextResponse.json(
      { ok: false, error: "线索不存在" },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, lead: updated });
}
