"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * 慢速连接助手 —— 自动侦测国内访问困难的用户
 *
 * 机制：
 * 1. 页面加载后3秒，尝试请求一个轻量图片（/_next的某个chunk或/icon.svg）
 * 2. 同时尝试请求/api/ai-image一张小图
 * 3. 如果任一超过8秒没完成，弹出右下角浮动帮助按钮
 * 4. 用户看到后可点击跳转到 /help/china
 */
export default function SlowConnectionHelper() {
  const [showHelper, setShowHelper] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // 曾经 dismiss 过就不再打扰
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("china-helper-dismissed") === "1") {
      setDismissed(true);
      return;
    }

    let done = false;
    const timer = setTimeout(async () => {
      if (done) return;
      // 测试Vercel自家资源访问速度
      const start = performance.now();
      try {
        const res = await fetch("/icon.svg", {
          cache: "no-store",
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) throw new Error("resource failed");
        const elapsed = performance.now() - start;
        // 如果静态资源加载>5秒，判定为慢速连接
        if (elapsed > 5000) {
          setShowHelper(true);
        }
      } catch {
        // fetch失败/超时，肯定慢
        setShowHelper(true);
      }
      done = true;
    }, 3000);

    return () => {
      clearTimeout(timer);
      done = true;
    };
  }, []);

  if (dismissed || !showHelper) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 max-w-xs p-4 rounded-xl bg-gradient-to-br from-amber-500/90 to-orange-500/90 backdrop-blur shadow-2xl shadow-orange-500/30 border border-amber-300/40 text-white animate-fade-in-up"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 text-2xl">🇨🇳</div>
        <div className="flex-1">
          <div className="font-bold text-sm">加载偏慢？</div>
          <p className="text-xs text-white/90 mt-1 leading-relaxed">
            检测到您可能在中国大陆访问。我们准备了3分钟解决的提速指南。
          </p>
          <div className="flex items-center gap-2 mt-3">
            <Link
              href="/help/china"
              className="text-xs px-3 py-1.5 rounded-md bg-white text-orange-700 font-medium hover:bg-gray-100 transition-colors"
            >
              查看指南
            </Link>
            <button
              type="button"
              onClick={() => {
                sessionStorage.setItem("china-helper-dismissed", "1");
                setDismissed(true);
              }}
              className="text-xs px-2 py-1.5 rounded-md text-white/90 hover:text-white hover:bg-white/10 transition-colors"
            >
              不再提示
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
