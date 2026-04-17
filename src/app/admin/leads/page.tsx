"use client";

import { useCallback, useEffect, useState } from "react";

type LeadRecord = {
  id: string;
  source: string;
  phone?: string;
  wechat?: string;
  name?: string;
  need?: string;
  detail?: string;
  industry?: string;
  style?: string;
  duration?: string;
  theme?: string;
  createdAt: string;
  ip?: string;
  status: "new" | "contacted" | "converted" | "dropped";
  note?: string;
};

type Stats = {
  total: number;
  todayCount: number;
  bySource: Record<string, number>;
  byStatus: Record<string, number>;
};

const SOURCE_LABELS: Record<string, string> = {
  "prompt-generator": "提示词生成器",
  "contact-form": "联系表单",
  "pricing-cta": "定价页CTA",
  "hero-cta": "首屏CTA",
  unknown: "未知来源",
};

const STATUS_LABELS: Record<LeadRecord["status"], string> = {
  new: "待联系",
  contacted: "已联系",
  converted: "已成交",
  dropped: "已放弃",
};

const STATUS_COLORS: Record<LeadRecord["status"], string> = {
  new: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  contacted: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  converted: "bg-green-500/20 text-green-300 border-green-500/30",
  dropped: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export default function AdminLeadsPage() {
  const [token, setToken] = useState<string>("");
  const [authed, setAuthed] = useState(false);
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterSource, setFilterSource] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // 读取localStorage中保存的token
  useEffect(() => {
    const saved = localStorage.getItem("admin-token");
    if (saved) {
      setToken(saved);
      setAuthed(true);
    }
  }, []);

  const fetchLeads = useCallback(
    async (authToken: string) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (filterSource) params.set("source", filterSource);
        if (filterStatus) params.set("status", filterStatus);
        const qs = params.toString();
        const res = await fetch(`/api/admin/leads${qs ? "?" + qs : ""}`, {
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
          setLeads(data.leads);
          setStats(data.stats);
        } else {
          setError(data.error || "加载失败");
        }
      } catch (e) {
        setError("网络错误");
      } finally {
        setLoading(false);
      }
    },
    [filterSource, filterStatus]
  );

  useEffect(() => {
    if (authed && token) fetchLeads(token);
  }, [authed, token, fetchLeads]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!token.trim()) return;
    localStorage.setItem("admin-token", token.trim());
    setAuthed(true);
  }

  async function updateStatus(id: string, status: LeadRecord["status"]) {
    try {
      await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status }),
      });
      fetchLeads(token);
    } catch {
      setError("更新失败");
    }
  }

  function logout() {
    localStorage.removeItem("admin-token");
    setToken("");
    setAuthed(false);
  }

  // ============================================================
  // 未登录视图
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
            <h1 className="text-2xl font-bold">管理后台</h1>
            <p className="text-sm text-gray-400 mt-1">云创未来 · 线索管理系统</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              访问令牌
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-light border border-border/50 text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
              placeholder="请输入 ADMIN_TOKEN"
              required
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-2">
              默认令牌：<code className="text-accent-light">yuntech-admin-2026</code>
              （请在生产环境通过 .env.local 修改）
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold transition-all"
          >
            登录
          </button>
        </form>
      </div>
    );
  }

  // ============================================================
  // 已登录：主面板
  // ============================================================
  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* 顶部导航 */}
        <header className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
              云
            </div>
            <div>
              <h1 className="text-xl font-bold">线索管理后台</h1>
              <p className="text-xs text-gray-500">云创未来 AI</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchLeads(token)}
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

        {/* 数据统计卡片 */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="累计线索" value={stats.total} color="indigo" />
            <StatCard
              label="今日新增"
              value={stats.todayCount}
              color="purple"
              highlight
            />
            <StatCard
              label="待联系"
              value={stats.byStatus.new || 0}
              color="blue"
            />
            <StatCard
              label="已成交"
              value={stats.byStatus.converted || 0}
              color="green"
            />
          </div>
        )}

        {/* 来源分布 */}
        {stats && Object.keys(stats.bySource).length > 0 && (
          <div className="mb-6 p-5 rounded-xl bg-surface border border-border/50">
            <h3 className="text-sm font-medium text-gray-400 mb-3">来源分布</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.bySource).map(([src, count]) => (
                <span
                  key={src}
                  className="px-3 py-1.5 text-sm rounded-lg bg-surface-light border border-border/50"
                >
                  <span className="text-gray-300">
                    {SOURCE_LABELS[src] || src}
                  </span>
                  <span className="ml-2 text-accent-light font-semibold">
                    {count}
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 筛选器 */}
        <div className="mb-6 flex flex-wrap gap-3 items-center">
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="px-4 py-2 text-sm rounded-lg bg-surface border border-border/50 text-white focus:outline-none focus:border-accent"
          >
            <option value="">全部来源</option>
            {Object.entries(SOURCE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 text-sm rounded-lg bg-surface border border-border/50 text-white focus:outline-none focus:border-accent"
          >
            <option value="">全部状态</option>
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          {loading && (
            <span className="text-sm text-gray-500">加载中...</span>
          )}
          {error && (
            <span className="text-sm text-red-400">{error}</span>
          )}
        </div>

        {/* 线索列表 */}
        <div className="space-y-3">
          {leads.length === 0 && !loading && (
            <div className="p-12 rounded-xl bg-surface border border-border/50 text-center text-gray-500">
              暂无线索 —— 开始投放引流，让第一条线索到来吧 🚀
            </div>
          )}
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="p-5 rounded-xl bg-surface border border-border/50 hover:border-accent/30 transition-colors"
            >
              <div className="flex items-start justify-between flex-wrap gap-4 mb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`px-2.5 py-1 text-xs rounded-full border ${STATUS_COLORS[lead.status]}`}
                  >
                    {STATUS_LABELS[lead.status]}
                  </span>
                  <span className="text-xs text-gray-500">
                    {SOURCE_LABELS[lead.source] || lead.source}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(lead.createdAt).toLocaleString("zh-CN")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {lead.status !== "contacted" && (
                    <button
                      onClick={() => updateStatus(lead.id, "contacted")}
                      className="px-3 py-1 text-xs rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors"
                    >
                      标记已联系
                    </button>
                  )}
                  {lead.status !== "converted" && (
                    <button
                      onClick={() => updateStatus(lead.id, "converted")}
                      className="px-3 py-1 text-xs rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-colors"
                    >
                      标记成交
                    </button>
                  )}
                  {lead.status !== "dropped" && (
                    <button
                      onClick={() => updateStatus(lead.id, "dropped")}
                      className="px-3 py-1 text-xs rounded-lg bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 transition-colors"
                    >
                      放弃
                    </button>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  {lead.phone && (
                    <Info label="手机">
                      <a
                        href={`tel:${lead.phone}`}
                        className="text-accent-light hover:underline font-mono"
                      >
                        {lead.phone}
                      </a>
                    </Info>
                  )}
                  {lead.wechat && (
                    <Info label="微信">
                      <span className="font-mono text-white">
                        {lead.wechat}
                      </span>
                    </Info>
                  )}
                  {lead.name && <Info label="姓名">{lead.name}</Info>}
                  {lead.need && <Info label="需求类型">{lead.need}</Info>}
                </div>
                <div className="space-y-2">
                  {lead.theme && <Info label="主题">{lead.theme}</Info>}
                  {lead.industry && (
                    <Info label="行业">{lead.industry}</Info>
                  )}
                  {lead.style && <Info label="风格">{lead.style}</Info>}
                  {lead.duration && (
                    <Info label="时长">{lead.duration}</Info>
                  )}
                </div>
              </div>

              {lead.detail && (
                <div className="mt-3 p-3 rounded-lg bg-background/50 border border-border/30 text-sm text-gray-300">
                  <span className="text-xs text-gray-500 block mb-1">
                    详细描述：
                  </span>
                  {lead.detail}
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
}: {
  label: string;
  value: number;
  color: "indigo" | "purple" | "blue" | "green";
  highlight?: boolean;
}) {
  const colors = {
    indigo: "from-indigo-500/20 to-indigo-500/5",
    purple: "from-purple-500/20 to-purple-500/5",
    blue: "from-blue-500/20 to-blue-500/5",
    green: "from-green-500/20 to-green-500/5",
  };
  return (
    <div
      className={`p-5 rounded-xl bg-gradient-to-br ${colors[color]} border ${highlight ? "border-accent/40" : "border-border/50"}`}
    >
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

function Info({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-2">
      <span className="text-gray-500 shrink-0">{label}：</span>
      <span className="text-gray-200 break-all">{children}</span>
    </div>
  );
}
