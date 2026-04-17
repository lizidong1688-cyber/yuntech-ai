/**
 * 线索存储层
 *
 * 当前实现：JSON文件持久化，适合MVP阶段（前几百条线索）
 * 升级路径：可替换为SQLite / Vercel KV / Postgres 而不改变上层接口
 *
 * 文件位置：项目根目录 .data/leads.json（已加入.gitignore避免提交）
 */

import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export type LeadSource =
  | "prompt-generator" // 来自AI提示词生成器
  | "contact-form" // 来自联系我们表单
  | "pricing-cta" // 来自定价页面CTA
  | "hero-cta" // 来自首屏CTA
  | "unknown";

export interface LeadInput {
  source: LeadSource;
  phone?: string;
  wechat?: string;
  name?: string;
  need?: string; // 需求类型（对应联系表单的select值）
  detail?: string; // 详细描述
  // 提示词生成器专属字段
  industry?: string;
  style?: string;
  duration?: string;
  theme?: string;
}

export interface LeadRecord extends LeadInput {
  id: string;
  createdAt: string; // ISO 8601
  ip?: string;
  userAgent?: string;
  // 处理状态
  status: "new" | "contacted" | "converted" | "dropped";
  note?: string;
}

// ============================================================
// 存储实现
// ============================================================

const DATA_DIR = path.join(process.cwd(), ".data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

async function ensureFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(LEADS_FILE);
  } catch {
    await fs.writeFile(LEADS_FILE, "[]", "utf-8");
  }
}

async function readAll(): Promise<LeadRecord[]> {
  await ensureFile();
  try {
    const raw = await fs.readFile(LEADS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAll(leads: LeadRecord[]): Promise<void> {
  await ensureFile();
  await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
}

// ============================================================
// 公共API
// ============================================================

export async function saveLead(
  input: LeadInput,
  meta: { ip?: string; userAgent?: string } = {}
): Promise<LeadRecord> {
  const leads = await readAll();
  const record: LeadRecord = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ip: meta.ip,
    userAgent: meta.userAgent,
    status: "new",
  };
  leads.unshift(record); // 新的排在前面
  await writeAll(leads);
  return record;
}

export async function listLeads(opts?: {
  source?: LeadSource;
  status?: LeadRecord["status"];
  limit?: number;
}): Promise<LeadRecord[]> {
  let leads = await readAll();
  if (opts?.source) {
    leads = leads.filter((l) => l.source === opts.source);
  }
  if (opts?.status) {
    leads = leads.filter((l) => l.status === opts.status);
  }
  if (opts?.limit) {
    leads = leads.slice(0, opts.limit);
  }
  return leads;
}

export async function countLeads(): Promise<{
  total: number;
  bySource: Record<string, number>;
  byStatus: Record<string, number>;
  todayCount: number;
}> {
  const leads = await readAll();
  const bySource: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  let todayCount = 0;

  for (const l of leads) {
    bySource[l.source] = (bySource[l.source] || 0) + 1;
    byStatus[l.status] = (byStatus[l.status] || 0) + 1;
    if (new Date(l.createdAt) >= todayStart) todayCount++;
  }

  return {
    total: leads.length,
    bySource,
    byStatus,
    todayCount,
  };
}

export async function updateLeadStatus(
  id: string,
  status: LeadRecord["status"],
  note?: string
): Promise<LeadRecord | null> {
  const leads = await readAll();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx === -1) return null;
  leads[idx] = { ...leads[idx], status, note: note ?? leads[idx].note };
  await writeAll(leads);
  return leads[idx];
}

// ============================================================
// IP限流：简单内存计数器（每小时每IP最多10次提交）
// ============================================================

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const HOUR_MS = 60 * 60 * 1000;
const MAX_PER_HOUR = 10;

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + HOUR_MS });
    return false;
  }
  if (entry.count >= MAX_PER_HOUR) return true;
  entry.count++;
  return false;
}

// 定期清理过期条目（避免内存泄漏，简易版）
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of rateLimitMap.entries()) {
      if (entry.resetAt < now) rateLimitMap.delete(ip);
    }
  }, HOUR_MS);
}

// ============================================================
// 校验
// ============================================================

export function validateLead(input: unknown): {
  ok: boolean;
  data?: LeadInput;
  error?: string;
} {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "invalid payload" };
  }
  const i = input as Record<string, unknown>;

  // 至少要有一种联系方式
  const phone = typeof i.phone === "string" ? i.phone.trim() : "";
  const wechat = typeof i.wechat === "string" ? i.wechat.trim() : "";
  if (!phone && !wechat) {
    return { ok: false, error: "请至少填写手机号或微信号" };
  }

  // 手机号格式（中国大陆）
  if (phone && !/^1[3-9]\d{9}$/.test(phone)) {
    return { ok: false, error: "手机号格式不正确" };
  }

  // 蜜罐字段：如果填了 website 字段（机器人会填），标记为垃圾
  if (typeof i.website === "string" && i.website.length > 0) {
    return { ok: false, error: "检测到异常提交" };
  }

  const source = typeof i.source === "string" ? i.source : "unknown";
  const validSources: LeadSource[] = [
    "prompt-generator",
    "contact-form",
    "pricing-cta",
    "hero-cta",
    "unknown",
  ];
  const finalSource = (validSources as string[]).includes(source)
    ? (source as LeadSource)
    : "unknown";

  return {
    ok: true,
    data: {
      source: finalSource,
      phone: phone || undefined,
      wechat: wechat || undefined,
      name: typeof i.name === "string" ? i.name.trim() : undefined,
      need: typeof i.need === "string" ? i.need : undefined,
      detail: typeof i.detail === "string" ? i.detail.trim() : undefined,
      industry: typeof i.industry === "string" ? i.industry : undefined,
      style: typeof i.style === "string" ? i.style : undefined,
      duration: typeof i.duration === "string" ? i.duration : undefined,
      theme: typeof i.theme === "string" ? i.theme : undefined,
    },
  };
}
