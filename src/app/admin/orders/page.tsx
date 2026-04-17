"use client";

import { useCallback, useEffect, useState } from "react";

type Order = {
  id: string;
  productSlug: string;
  productName: string;
  priceYuan: number;
  buyerPhone?: string;
  buyerWechat?: string;
  paymentMethod: "alipay" | "wechat";
  paymentRef?: string;
  note?: string;
  status: "pending" | "confirmed" | "delivered" | "refunded";
  downloadToken?: string;
  downloadExpiresAt?: string;
  createdAt: string;
  confirmedAt?: string;
  deliveredAt?: string;
  ip?: string;
};

type Stats = {
  total: number;
  pending: number;
  confirmed: number;
  delivered: number;
  revenue: number;
};

const STATUS_LABELS: Record<Order["status"], string> = {
  pending: "待确认付款",
  confirmed: "已确认·待下载",
  delivered: "已下载完成",
  refunded: "已退款",
};

const STATUS_COLORS: Record<Order["status"], string> = {
  pending: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  confirmed: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  delivered: "bg-green-500/20 text-green-300 border-green-500/30",
  refunded: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export default function AdminOrdersPage() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("admin-token");
    if (saved) {
      setToken(saved);
      setAuthed(true);
    }
  }, []);

  const fetchOrders = useCallback(
    async (authToken: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/orders", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (res.status === 401) {
          setAuthed(false);
          localStorage.removeItem("admin-token");
          setError("认证失败，请重新登录");
          return;
        }
        const data = await res.json();
        if (data.ok) {
          setOrders(data.orders);
          setStats(data.stats);
        } else {
          setError(data.error || "加载失败");
        }
      } catch {
        setError("网络错误");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (authed && token) fetchOrders(token);
  }, [authed, token, fetchOrders]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!token.trim()) return;
    localStorage.setItem("admin-token", token.trim());
    setAuthed(true);
  }

  async function confirmOrder(id: string) {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, action: "confirm" }),
      });
      const data = await res.json();
      if (data.ok) {
        fetchOrders(token);
      } else {
        setError(data.error || "操作失败");
      }
    } catch {
      setError("网络错误");
    }
  }

  function copyDownloadUrl(order: Order) {
    if (!order.downloadToken) return;
    const url = `${window.location.origin}/api/download/${order.downloadToken}`;
    const msg = `您好！
您购买的《${order.productName}》订单已确认，下载链接：
${url}

⚠️ 链接24小时内有效，请尽快下载保存。

如有问题随时联系我。感谢您的信任！`;
    navigator.clipboard.writeText(msg);
    setCopiedId(order.id);
    setTimeout(() => setCopiedId(null), 3000);
  }

  function logout() {
    localStorage.removeItem("admin-token");
    setToken("");
    setAuthed(false);
  }

  // ============================================================
  // 未登录
  // ============================================================
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md p-8 rounded-2xl bg-surface border border-border/50 space-y-5"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mx-auto flex items-center justify-center text-2xl font-bold text-white mb-3">
              云
            </div>
            <h1 className="text-2xl font-bold">订单管理</h1>
            <p className="text-sm text-gray-400 mt-1">云创未来 · 收银台</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">访问令牌</label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-light border border-border/50 text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
              placeholder="ADMIN_TOKEN"
              required
              autoFocus
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold"
          >
            登录
          </button>

          <div className="text-center text-sm">
            <a
              href="/admin/leads"
              className="text-accent-light hover:underline"
            >
              → 切换到线索管理
            </a>
          </div>
        </form>
      </div>
    );
  }

  // ============================================================
  // 已登录
  // ============================================================
  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
              云
            </div>
            <div>
              <h1 className="text-xl font-bold">订单收银台</h1>
              <p className="text-xs text-gray-500">
                确认付款后一键复制发给客户
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/admin/leads"
              className="px-4 py-2 text-sm rounded-lg bg-surface-light hover:bg-border transition-colors"
            >
              线索
            </a>
            <button
              onClick={() => fetchOrders(token)}
              className="px-4 py-2 text-sm rounded-lg bg-surface-light hover:bg-border transition-colors"
            >
              刷新
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              退出
            </button>
          </div>
        </header>

        {/* 统计 */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            <StatCard label="总订单" value={stats.total} color="indigo" />
            <StatCard
              label="待确认付款"
              value={stats.pending}
              color="amber"
              highlight={stats.pending > 0}
            />
            <StatCard label="已确认" value={stats.confirmed} color="blue" />
            <StatCard label="已交付" value={stats.delivered} color="green" />
            <StatCard
              label="总收入 ¥"
              value={stats.revenue}
              color="purple"
              isRevenue
            />
          </div>
        )}

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* 订单列表 */}
        <div className="space-y-3">
          {orders.length === 0 && !loading && (
            <div className="p-12 rounded-xl bg-surface border border-border/50 text-center text-gray-500">
              暂无订单 —— 等等你的第一桶金 💰
            </div>
          )}

          {orders.map((order) => (
            <div
              key={order.id}
              className={`p-5 rounded-xl border transition-colors ${
                order.status === "pending"
                  ? "bg-amber-500/5 border-amber-500/30"
                  : "bg-surface border-border/50 hover:border-accent/30"
              }`}
            >
              <div className="flex items-start justify-between flex-wrap gap-4 mb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`px-2.5 py-1 text-xs rounded-full border ${STATUS_COLORS[order.status]}`}
                  >
                    {STATUS_LABELS[order.status]}
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {order.productName}
                  </span>
                  <span className="text-xl font-bold text-accent-light">
                    ¥{order.priceYuan}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleString("zh-CN")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {order.status === "pending" && (
                    <button
                      onClick={() => confirmOrder(order.id)}
                      className="px-4 py-2 text-sm rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-colors font-medium"
                    >
                      ✓ 确认付款 · 生成下载链接
                    </button>
                  )}
                  {order.downloadToken && (
                    <button
                      onClick={() => copyDownloadUrl(order)}
                      className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                        copiedId === order.id
                          ? "bg-blue-500/30 text-blue-200"
                          : "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                      }`}
                    >
                      {copiedId === order.id
                        ? "✓ 已复制交付话术"
                        : "📋 复制交付话术+链接"}
                    </button>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="text-gray-500 text-xs">联系方式</div>
                  {order.buyerWechat && (
                    <div className="font-mono text-gray-200">
                      微信：{order.buyerWechat}
                    </div>
                  )}
                  {order.buyerPhone && (
                    <div className="font-mono text-gray-200">
                      <a
                        href={`tel:${order.buyerPhone}`}
                        className="text-accent-light hover:underline"
                      >
                        {order.buyerPhone}
                      </a>
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-gray-500 text-xs">支付方式</div>
                  <div className="text-gray-200">
                    {order.paymentMethod === "wechat" ? "💬 微信支付" : "💰 支付宝"}
                  </div>
                  {order.paymentRef && (
                    <div className="text-xs text-gray-400 mt-1">
                      凭证：{order.paymentRef}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-gray-500 text-xs">订单号</div>
                  <div className="font-mono text-xs text-gray-400 break-all">
                    {order.id}
                  </div>
                </div>
              </div>

              {order.note && (
                <div className="mt-3 p-3 rounded-lg bg-background/50 border border-border/30 text-sm text-gray-300">
                  <span className="text-xs text-gray-500 block mb-1">
                    客户备注：
                  </span>
                  {order.note}
                </div>
              )}

              {order.downloadToken && order.downloadExpiresAt && (
                <div className="mt-3 p-3 rounded-lg bg-background/50 border border-border/30 text-xs text-gray-400">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span>
                      下载链接有效期至:{" "}
                      <span className="text-gray-200">
                        {new Date(order.downloadExpiresAt).toLocaleString(
                          "zh-CN"
                        )}
                      </span>
                    </span>
                    <code className="text-accent-light break-all">
                      /api/download/{order.downloadToken.slice(0, 16)}...
                    </code>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
  highlight,
  isRevenue,
}: {
  label: string;
  value: number;
  color: "indigo" | "amber" | "blue" | "green" | "purple";
  highlight?: boolean;
  isRevenue?: boolean;
}) {
  const colors = {
    indigo: "from-indigo-500/20 to-indigo-500/5",
    amber: "from-amber-500/20 to-amber-500/5",
    blue: "from-blue-500/20 to-blue-500/5",
    green: "from-green-500/20 to-green-500/5",
    purple: "from-purple-500/20 to-purple-500/5",
  };
  return (
    <div
      className={`p-4 rounded-xl bg-gradient-to-br ${colors[color]} border ${highlight ? "border-accent/40 ring-2 ring-accent/30 animate-pulse" : "border-border/50"}`}
    >
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-2xl font-bold mt-1">
        {isRevenue ? `¥${value.toFixed(1)}` : value}
      </p>
    </div>
  );
}
