"use client";

import { useState } from "react";

const navLinks = [
  { label: "工作室", href: "/studio", highlight: true },
  { label: "商品", href: "/shop" },
  { label: "案例库", href: "/showcases" },
  { label: "免费工具", href: "/#generator" },
  { label: "关于", href: "/#about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              云
            </div>
            <span className="text-lg font-bold">
              云创<span className="text-accent-light">未来</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${
                  link.highlight
                    ? "text-accent-light hover:text-white font-medium"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {link.label}
                {link.highlight && (
                  <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-accent-light animate-pulse" />
                )}
              </a>
            ))}
            <a
              href="#contact"
              className="px-4 py-2 text-sm font-medium rounded-lg bg-accent hover:bg-accent-light text-white transition-colors"
            >
              免费咨询
            </a>
          </div>

          <button
            className="md:hidden text-gray-400"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block text-sm text-gray-400 hover:text-white transition-colors"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="block w-full text-center px-4 py-2 text-sm font-medium rounded-lg bg-accent text-white"
              onClick={() => setOpen(false)}
            >
              免费咨询
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
