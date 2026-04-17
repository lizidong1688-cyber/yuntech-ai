"use client";

import { useState } from "react";
import {
  generatePrompts,
  INDUSTRY_OPTIONS,
  STYLE_OPTIONS,
  DURATION_OPTIONS,
  type Industry,
  type Style,
  type Duration,
  type GeneratedPrompt,
} from "@/lib/promptGenerator";

type Step = "input" | "result" | "capture" | "success";

export default function PromptGenerator() {
  const [step, setStep] = useState<Step>("input");
  const [industry, setIndustry] = useState<Industry>("ecommerce");
  const [style, setStyle] = useState<Style>("cinematic");
  const [duration, setDuration] = useState<Duration>("medium");
  const [theme, setTheme] = useState("");
  const [prompts, setPrompts] = useState<GeneratedPrompt[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [phone, setPhone] = useState("");
  const [wechat, setWechat] = useState("");
  const [website, setWebsite] = useState(""); // 蜜罐
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleGenerate() {
    if (!theme.trim()) return;
    const result = generatePrompts({ industry, style, duration, theme: theme.trim() });
    setPrompts(result);
    setStep("result");
    // 平滑滚动到结果位置
    setTimeout(() => {
      document.getElementById("prompt-result")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }

  function handleCopy(text: string, idx: number) {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  }

  async function handleCaptureSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim() && !wechat.trim()) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "prompt-generator",
          phone,
          wechat,
          industry,
          style,
          duration,
          theme,
          website, // 蜜罐
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setStep("success");
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
    <section id="generator" className="py-24 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-sm text-accent-light mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            免费工具 · 无需注册
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold">
            AI视频提示词生成器
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            三步生成专业级AI视频提示词，让您的创意直接可用。基于我们服务过100+商业项目的经验沉淀。
          </p>
        </div>

        {step === "input" && (
          <div className="p-8 rounded-2xl bg-surface border border-border/50 space-y-6">
            {/* 第一步：选择行业 */}
            <div>
              <label className="block text-sm font-medium mb-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent-light text-xs mr-2">1</span>
                您的行业场景
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {INDUSTRY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setIndustry(opt.value)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      industry === opt.value
                        ? "bg-accent text-white shadow-lg shadow-accent/30"
                        : "bg-surface-light text-gray-300 hover:bg-border"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 第二步：选择风格 */}
            <div>
              <label className="block text-sm font-medium mb-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent-light text-xs mr-2">2</span>
                视觉风格调性
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {STYLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStyle(opt.value)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      style === opt.value
                        ? "bg-accent text-white shadow-lg shadow-accent/30"
                        : "bg-surface-light text-gray-300 hover:bg-border"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 第三步：时长 + 主题 */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium mb-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent-light text-xs mr-2">3</span>
                  视频时长
                </label>
                <div className="space-y-2">
                  {DURATION_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setDuration(opt.value)}
                      className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        duration === opt.value
                          ? "bg-accent text-white"
                          : "bg-surface-light text-gray-300 hover:bg-border"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent-light text-xs mr-2">4</span>
                  产品或主题关键词
                </label>
                <textarea
                  rows={5}
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-light border border-border/50 text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors resize-none"
                  placeholder="例如：轻奢风白色陶瓷咖啡杯、海景三居室样板间、儿童编程课程试听课..."
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={!theme.trim()}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-lg transition-all shadow-lg shadow-indigo-500/25"
            >
              立即生成专业提示词 →
            </button>
          </div>
        )}

        {step === "result" && (
          <div id="prompt-result" className="space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-xl font-semibold">为您生成的3条专业提示词</h3>
                <p className="text-sm text-gray-400 mt-1">
                  点击复制按钮即可使用，建议三条搭配使用构成完整视频
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStep("input")}
                className="text-sm text-accent-light hover:text-white transition-colors"
              >
                ← 重新生成
              </button>
            </div>

            {prompts.map((p, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-surface border border-border/50 hover:border-accent/30 transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-accent-light">{p.title}</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(p.prompt, idx)}
                    className="shrink-0 px-3 py-1.5 text-xs rounded-lg bg-surface-light hover:bg-border border border-border/50 text-gray-300 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    {copiedIdx === idx ? (
                      <>
                        <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        已复制
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        复制
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-background/50 border border-border/30 text-sm text-gray-200 leading-relaxed font-mono">
                  {p.prompt}
                </div>

                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">💡 使用建议：</p>
                  <ul className="space-y-1">
                    {p.tips.map((tip, i) => (
                      <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                        <span className="text-accent-light mt-1">·</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

            {/* CTA：引导领取免费样片 */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-accent/20 to-purple-500/20 border border-accent/40 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-white/80 mb-4">
                🎁 限时福利
              </div>
              <h3 className="text-2xl font-bold mb-3">
                想直接拿到成片，而不只是提示词？
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                留下联系方式，我们将用这些提示词为您免费生成一条<strong className="text-white">真实AI视频样片</strong>，24小时内发送给您——
                <strong className="text-white">零成本体验AI内容生产的魔力。</strong>
              </p>
              <button
                type="button"
                onClick={() => setStep("capture")}
                className="px-8 py-4 rounded-xl bg-white text-background hover:bg-gray-100 font-semibold transition-colors shadow-lg"
              >
                免费领取真实视频样片 →
              </button>
            </div>
          </div>
        )}

        {step === "capture" && (
          <div className="max-w-xl mx-auto p-8 rounded-2xl bg-surface border border-accent/30 animate-fade-in-up">
            <h3 className="text-2xl font-bold mb-2">最后一步</h3>
            <p className="text-gray-400 mb-6">
              留下联系方式，我们将在24小时内把AI生成的样片发送给您
            </p>

            <form onSubmit={handleCaptureSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">
                  手机号 <span className="text-gray-500 text-xs">（微信同号更佳）</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-light border border-border/50 text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
                  placeholder="13800138000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  微信号 <span className="text-gray-500 text-xs">（可选）</span>
                </label>
                <input
                  type="text"
                  value={wechat}
                  onChange={(e) => setWechat(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-light border border-border/50 text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
                  placeholder="您的微信号"
                />
              </div>

              {/* 蜜罐字段：隐藏 */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div className="p-4 rounded-xl bg-background/50 border border-border/30 text-xs text-gray-400 leading-relaxed">
                <strong className="text-gray-300">隐私承诺：</strong>
                您的联系方式仅用于本次样片交付，我们不会用于任何骚扰营销。样片归您所有，可商用。
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep("result")}
                  className="px-6 py-3 rounded-xl bg-surface-light hover:bg-border text-gray-300 transition-colors"
                >
                  返回
                </button>
                <button
                  type="submit"
                  disabled={(!phone.trim() && !wechat.trim()) || submitting}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition-all"
                >
                  {submitting ? "提交中..." : "提交并领取样片"}
                </button>
              </div>
            </form>
          </div>
        )}

        {step === "success" && (
          <div className="max-w-xl mx-auto p-12 rounded-2xl bg-gradient-to-br from-green-500/10 to-accent/10 border border-green-500/30 text-center animate-fade-in-up">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3">收到，马上开工！</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              我们已收到您的需求，正在为您生成AI视频样片。
              <br />
              预计<strong className="text-white">24小时内</strong>通过微信/短信发送给您。
              <br />
              <span className="text-sm text-gray-400 mt-2 inline-block">
                如有任何问题，可直接联系：contact@yunchuangweilai.com
              </span>
            </p>
            <button
              type="button"
              onClick={() => {
                setStep("input");
                setTheme("");
                setPhone("");
                setWechat("");
              }}
              className="text-sm text-accent-light hover:text-white transition-colors"
            >
              再生成一次 →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
