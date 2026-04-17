import { NextRequest, NextResponse } from "next/server";
import { createOrder, listOrders } from "@/lib/orderStorage";
import { getProduct } from "@/lib/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

/**
 * 创建订单（买家提交付款凭证）
 */
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "无效请求" },
        { status: 400 }
      );
    }

    const {
      productSlug,
      paymentMethod,
      buyerPhone,
      buyerWechat,
      paymentRef,
      note,
    } = body as Record<string, string>;

    const product = getProduct(productSlug);
    if (!product) {
      return NextResponse.json(
        { ok: false, error: "商品不存在" },
        { status: 404 }
      );
    }

    if (
      !buyerPhone?.trim() &&
      !buyerWechat?.trim()
    ) {
      return NextResponse.json(
        { ok: false, error: "请至少填写微信号或手机号" },
        { status: 400 }
      );
    }

    if (paymentMethod !== "alipay" && paymentMethod !== "wechat") {
      return NextResponse.json(
        { ok: false, error: "支付方式无效" },
        { status: 400 }
      );
    }

    // 手机号格式校验
    if (buyerPhone && !/^1[3-9]\d{9}$/.test(buyerPhone)) {
      return NextResponse.json(
        { ok: false, error: "手机号格式不正确" },
        { status: 400 }
      );
    }

    const order = await createOrder({
      productSlug,
      productName: product.name,
      priceYuan: product.priceYuan,
      paymentMethod,
      buyerPhone: buyerPhone?.trim(),
      buyerWechat: buyerWechat?.trim(),
      paymentRef: paymentRef?.trim(),
      note: note?.trim(),
      ip,
    });

    // 日志记录（管理员可在Vercel Logs查看所有订单）
    console.log(
      `💰 [ORDER] ${new Date().toISOString()} | product=${product.shortName} | price=¥${product.priceYuan} | wechat=${buyerWechat || "-"} | phone=${buyerPhone || "-"} | paymentRef=${paymentRef || "-"} | orderId=${order.id}`
    );

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      message: "订单已提交，我们将尽快联系您",
    });
  } catch (err) {
    console.error("[api/order] error:", err);
    return NextResponse.json(
      { ok: false, error: "服务异常，请稍后重试" },
      { status: 500 }
    );
  }
}
