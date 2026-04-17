"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";

type Step = "idle" | "payment" | "verify" | "success";

interface Props {
  product: Product;
}

export default function PurchaseFlow({ product }: Props) {
  const [step, setStep] = useState<Step>("idle");
  const [paymentMethod, setPaymentMethod] = useState<"alipay" | "wechat">(
    "wechat"
  );
  const [form, setForm] = useState({
    buyerWechat: "",
    buyerPhone: "",
    paymentRef: "",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.buyerWechat.trim() && !form.buyerPhone.trim()) {
      setError("请至少填写微信号或手机号，以便我们发送下载链接");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug: product.slug,
          paymentMethod,
          ...form,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setOrderId(data.orderId);
        setStep("success");
      } else {
        setError(data.error || "提交失败，请重试或直接加微信联系");
      }
    } catch {
      setError("网络错误，请重试");
    } finally {
      setSubmitting(false);
    }
  }

  // ============================================================
  // 1. 初始态：大CTA按钮
  // ============================================================
  if (step === "idle") {
    return (
      <div className="p-8 rounded-2xl bg-gradient-to-br from-accent/20 via-purple-500/10 to-surface border border-accent/30 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-white/90 mb-4">
          ⚡ 24小时内发货 · 永久使用
        </div>
        <h2 className="text-3xl font-bold mb-3">
          立即拥有{product.shortName}
        </h2>
        <p className="text-gray-300 mb-8 max-w-xl mx-auto">
          支持支付宝/微信支付 · 付款后填写微信即可收到下载链接
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button
            type="button"
            onClick={() => setStep("payment")}
            className="px-10 py-4 rounded-xl bg-white text-background font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            立即购买 ¥{product.priceYuan}
            {product.originalPriceYuan && (
              <span className="text-sm text-gray-500 line-through ml-2">
                原价¥{product.originalPriceYuan}
              </span>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-6">
          购买即视为同意《商业授权协议》· 虚拟商品原则上不支持退款
        </p>
      </div>
    );
  }

  // ============================================================
  // 2. 支付态：显示收款码 + 付款说明
  // ============================================================
  if (step === "payment") {
    const qrSrc =
      paymentMethod === "wechat"
        ? "/payment/wechat-qr.svg"
        : "/payment/alipay-qr.svg";

    return (
      <div className="p-8 rounded-2xl bg-surface border border-accent/30">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">扫码支付</h2>
          <button
            type="button"
            onClick={() => setStep("idle")}
            className="text-sm text-gray-400 hover:text-white"
          >
            ← 返回
          </button>
        </div>

        {/* 支付方式切换 */}
        <div className="flex gap-3 mb-6">
          <button
            type="button"
            onClick={() => setPaymentMethod("wechat")}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              paymentMethod === "wechat"
                ? "bg-green-500/20 border-2 border-green-500 text-green-300"
                : "bg-surface-light border-2 border-transparent text-gray-400 hover:text-white"
            }`}
          >
            💬 微信支付
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod("alipay")}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              paymentMethod === "alipay"
                ? "bg-blue-500/20 border-2 border-blue-500 text-blue-300"
                : "bg-surface-light border-2 border-transparent text-gray-400 hover:text-white"
            }`}
          >
            💰 支付宝
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* 二维码 */}
          <div className="text-center">
            <div className="inline-block p-6 rounded-2xl bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrSrc}
                alt={`${paymentMethod === "wechat" ? "微信" : "支付宝"}收款码`}
                className="w-48 h-48 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <div className="mt-4 text-2xl font-bold text-accent-light">
              ¥{product.priceYuan}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {paymentMethod === "wechat" ? "微信扫一扫" : "支付宝扫一扫"}
            </div>
          </div>

          {/* 付款说明 */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">付款步骤</h3>
            <ol className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent-light text-xs flex items-center justify-center font-semibold">
                  1
                </span>
                <span>
                  打开
                  {paymentMethod === "wechat" ? "微信" : "支付宝"}
                  扫码，输入金额 <strong className="text-white">¥{product.priceYuan}</strong> 付款
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent-light text-xs flex items-center justify-center font-semibold">
                  2
                </span>
                <span>
                  付款备注 <strong className="text-white">{product.shortName}</strong>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent-light text-xs flex items-center justify-center font-semibold">
                  3
                </span>
                <span>
                  付款后点下方按钮，填写微信号
                </span>
              </li>
            </ol>

            <button
              type="button"
              onClick={() => setStep("verify")}
              className="mt-6 w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-semibold transition-all"
            >
              已完成付款 · 填写收货信息 →
            </button>

            <p className="mt-4 text-xs text-gray-500">
              遇到付款问题？添加微信 <strong className="text-gray-300">yuntechweilai</strong> 人工处理
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // 3. 验证态：填写联系方式和付款凭证
  // ============================================================
  if (step === "verify") {
    return (
      <div className="p-8 rounded-2xl bg-surface border border-accent/30">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">填写收货信息</h2>
            <p className="text-sm text-gray-400 mt-1">
              我们将通过微信/短信发送下载链接
            </p>
          </div>
          <button
            type="button"
            onClick={() => setStep("payment")}
            className="text-sm text-gray-400 hover:text-white"
          >
            ← 返回
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">
              微信号 <span className="text-red-400">*</span>
              <span className="text-xs text-gray-500 ml-2">
                （推荐，交付更快）
              </span>
            </label>
            <input
              type="text"
              value={form.buyerWechat}
              onChange={(e) =>
                setForm({ ...form, buyerWechat: e.target.value })
              }
              placeholder="您的微信号或昵称"
              className="w-full px-4 py-3 rounded-xl bg-surface-light border border-border/50 text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              手机号 <span className="text-xs text-gray-500">（可选）</span>
            </label>
            <input
              type="tel"
              value={form.buyerPhone}
              onChange={(e) =>
                setForm({ ...form, buyerPhone: e.target.value })
              }
              placeholder="13800138000"
              className="w-full px-4 py-3 rounded-xl bg-surface-light border border-border/50 text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              付款凭证 <span className="text-xs text-gray-500">（帮助我们更快核对）</span>
            </label>
            <input
              type="text"
              value={form.paymentRef}
              onChange={(e) =>
                setForm({ ...form, paymentRef: e.target.value })
              }
              placeholder="付款时间、金额末4位、或付款流水号"
              className="w-full px-4 py-3 rounded-xl bg-surface-light border border-border/50 text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              备注 <span className="text-xs text-gray-500">（可选）</span>
            </label>
            <textarea
              rows={3}
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="有特殊需求请告诉我们..."
              className="w-full px-4 py-3 rounded-xl bg-surface-light border border-border/50 text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors resize-none"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 text-xs text-gray-400 leading-relaxed">
            <strong className="text-gray-300">隐私承诺：</strong>
            您的联系方式仅用于本次交付。
            您的信息不会用于任何骚扰营销。
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:opacity-50 text-white font-semibold text-lg transition-all shadow-lg shadow-indigo-500/25"
          >
            {submitting ? "提交中..." : `确认购买 ¥${product.priceYuan}`}
          </button>
        </form>
      </div>
    );
  }

  // ============================================================
  // 4. 成功态：订单已提交
  // ============================================================
  return (
    <div className="p-10 rounded-2xl bg-gradient-to-br from-green-500/10 to-accent/10 border border-green-500/30 text-center">
      <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-10 h-10 text-green-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h2 className="text-3xl font-bold mb-3">订单已提交！</h2>
      <p className="text-gray-300 mb-2">
        订单号：<code className="text-accent-light">{orderId?.slice(0, 8)}</code>
      </p>
      <p className="text-gray-400 mb-6 leading-relaxed max-w-xl mx-auto">
        我们正在核对您的付款，
        <strong className="text-white">24小时内</strong>
        会通过您留下的微信/手机联系您并发送下载链接。
        <br />
        如果急用，请直接添加微信
        <strong className="text-accent-light"> yuntechweilai </strong>
        并发送订单号，通常1小时内处理。
      </p>
      <div className="inline-flex flex-col sm:flex-row items-center gap-3">
        <a
          href="/shop"
          className="px-6 py-3 rounded-xl bg-white text-background font-medium hover:bg-gray-100 transition-colors"
        >
          看看其他商品
        </a>
        <a
          href="/"
          className="px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors"
        >
          返回首页
        </a>
      </div>
    </div>
  );
}
