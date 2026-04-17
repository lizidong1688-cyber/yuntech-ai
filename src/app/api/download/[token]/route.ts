import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { findOrderByToken, markDelivered } from "@/lib/orderStorage";
import { getProduct } from "@/lib/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 受保护的商品下载
 *
 * 用户通过 /api/download/{token} 下载
 * Token由管理员确认订单后生成，24小时有效
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    if (!token || token.length < 16) {
      return NextResponse.json(
        { ok: false, error: "下载链接无效" },
        { status: 400 }
      );
    }

    const order = await findOrderByToken(token);
    if (!order) {
      return NextResponse.json(
        { ok: false, error: "下载链接无效或已过期（24小时有效）" },
        { status: 404 }
      );
    }

    const product = getProduct(order.productSlug);
    if (!product) {
      return NextResponse.json(
        { ok: false, error: "商品数据丢失" },
        { status: 500 }
      );
    }

    // 从项目根目录的 products/ 读取文件
    const filePath = path.join(process.cwd(), product.filePath);
    let file: Buffer;
    try {
      file = await fs.readFile(filePath);
    } catch {
      console.error(`[download] 文件不存在: ${filePath}`);
      return NextResponse.json(
        { ok: false, error: "商品文件暂时无法获取，请联系客服" },
        { status: 500 }
      );
    }

    // 标记为已交付
    await markDelivered(order.id);

    console.log(
      `📤 [DOWNLOAD] ${new Date().toISOString()} | orderId=${order.id} | product=${product.shortName} | size=${file.length}B`
    );

    const filename = encodeURIComponent(`${product.shortName}_v1.zip`);

    // Use a plain ArrayBuffer to satisfy BodyInit typing in edge environments
    const body = new Uint8Array(file);
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename*=UTF-8''${filename}`,
        "Content-Length": String(file.length),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[api/download] error:", err);
    return NextResponse.json(
      { ok: false, error: "服务异常，请联系客服" },
      { status: 500 }
    );
  }
}
