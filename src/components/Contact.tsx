"use client";

import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", need: "", detail: "" });
  const [website, setWebsite] = useState(""); // 蜜罐字段，真用户不填
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "contact-form",
          name: form.name,
          phone: form.phone,
          need: form.need,
          detail: form.detail,
          website, // 蜜罐
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || "提交失败，请稍后再试");
      }
    } catch {
      setError("网络错误，请稍后再试");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-accent-light text-sm font-medium tracking-wider uppercase">
            联系我们
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3">
            开始您的AI内容之旅
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            留下您的需求，我们将在2小时内与您取得联系
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="p-12 rounded-2xl bg-surface border border-green-500/30 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-400"
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
                <h3 className="text-xl font-semibold mb-2">提交成功！</h3>
                <p className="text-gray-400">
                  我们已收到您的需求，将在2小时内与您联系
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-8 rounded-2xl bg-surface border border-border/50 space-y-5"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      姓名 *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-surface-light border border-border/50 text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
                      placeholder="您的姓名"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      联系电话 *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-surface-light border border-border/50 text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
                      placeholder="您的手机号"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    需求类型 *
                  </label>
                  <select
                    required
                    value={form.need}
                    onChange={(e) =>
                      setForm({ ...form, need: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-surface-light border border-border/50 text-white focus:outline-none focus:border-accent transition-colors"
                  >
                    <option value="">请选择需求类型</option>
                    <option value="video">AI视频生成</option>
                    <option value="image">AI图像创作</option>
                    <option value="character">AI人物/IP形象</option>
                    <option value="batch">批量内容生产</option>
                    <option value="custom">定制化方案</option>
                    <option value="other">其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    需求描述
                  </label>
                  <textarea
                    rows={4}
                    value={form.detail}
                    onChange={(e) =>
                      setForm({ ...form, detail: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-surface-light border border-border/50 text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors resize-none"
                    placeholder="请简要描述您的需求，例如：需要为10款产品制作展示视频..."
                  />
                </div>

                {/* 蜜罐字段：隐藏，机器人会自动填 */}
                <div className="hidden" aria-hidden="true">
                  <label>Website (do not fill)</label>
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-lg transition-all shadow-lg shadow-indigo-500/25"
                >
                  {submitting ? "提交中..." : "提交需求"}
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-xl bg-surface border border-border/50">
              <h3 className="font-semibold mb-4">直接联系</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-accent-light mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium">公司地址</p>
                    <p className="text-sm text-gray-400">
                      海南省海口市复兴城互联网信息产业园
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-accent-light mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium">电子邮箱</p>
                    <p className="text-sm text-gray-400">
                      contact@yunchuangweilai.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-accent/10 to-purple-500/10 border border-accent/20">
              <h3 className="font-semibold mb-2">免费试用</h3>
              <p className="text-sm text-gray-400 mb-4">
                首次合作客户可免费获得一条AI视频样片，让您零风险体验AI创作的魅力
              </p>
              <div className="flex items-center gap-2 text-accent-light text-sm font-medium">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                  />
                </svg>
                限时活动进行中
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
