import { NextRequest, NextResponse } from "next/server";
import { listOrders, confirmOrder } from "@/lib/orderStorage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

  const orders = await listOrders();

  // 统计
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    revenue: orders
      .filter((o) => o.status === "confirmed" || o.status === "delivered")
      .reduce((sum, o) => sum + o.priceYuan, 0),
  };

  return NextResponse.json({ ok: true, orders, stats });
}

/**
 * 确认订单 → 生成下载Token
 */
export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json(
      { ok: false, error: "未授权" },
      { status: 401 }
    );
  }

  const body = (await req.json().catch(() => null)) as {
    id?: string;
    action?: "confirm";
  } | null;

  if (!body?.id) {
    return NextResponse.json(
      { ok: false, error: "缺少订单ID" },
      { status: 400 }
    );
  }

  if (body.action === "confirm") {
    const updated = await confirmOrder(body.id);
    if (!updated) {
      return NextResponse.json(
        { ok: false, error: "订单不存在" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      ok: true,
      order: updated,
      downloadUrl: `/api/download/${updated.downloadToken}`,
    });
  }

  return NextResponse.json(
    { ok: false, error: "不支持的操作" },
    { status: 400 }
  );
}
