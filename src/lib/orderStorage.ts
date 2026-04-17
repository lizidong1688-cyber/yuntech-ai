/**
 * 订单存储层（兼容Serverless）
 *
 * 与leadStorage类似的双模式存储策略
 */

import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import type { Order } from "./products";

const IS_READONLY_FS =
  process.env.VERCEL === "1" ||
  process.env.NETLIFY === "true" ||
  process.env.LAMBDA_TASK_ROOT !== undefined;

const DATA_DIR = path.join(process.cwd(), ".data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

let memoryStore: Order[] = [];

async function ensureFile(): Promise<void> {
  if (IS_READONLY_FS) return;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(ORDERS_FILE);
  } catch {
    await fs.writeFile(ORDERS_FILE, "[]", "utf-8");
  }
}

async function readAll(): Promise<Order[]> {
  if (IS_READONLY_FS) return memoryStore;
  await ensureFile();
  try {
    const raw = await fs.readFile(ORDERS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAll(orders: Order[]): Promise<void> {
  if (IS_READONLY_FS) {
    memoryStore = orders;
    return;
  }
  await ensureFile();
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
}

export interface CreateOrderInput {
  productSlug: string;
  productName: string;
  priceYuan: number;
  buyerPhone?: string;
  buyerWechat?: string;
  paymentMethod: "alipay" | "wechat";
  paymentRef?: string;
  note?: string;
  ip?: string;
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const orders = await readAll();
  const order: Order = {
    id: crypto.randomUUID(),
    productSlug: input.productSlug,
    productName: input.productName,
    priceYuan: input.priceYuan,
    buyerPhone: input.buyerPhone,
    buyerWechat: input.buyerWechat,
    paymentMethod: input.paymentMethod,
    paymentRef: input.paymentRef,
    note: input.note,
    status: "pending",
    createdAt: new Date().toISOString(),
    ip: input.ip,
  };
  orders.unshift(order);
  await writeAll(orders);
  return order;
}

export async function listOrders(): Promise<Order[]> {
  return await readAll();
}

export async function getOrder(id: string): Promise<Order | null> {
  const orders = await readAll();
  return orders.find((o) => o.id === id) || null;
}

/**
 * 确认订单并生成下载Token
 * （管理员手动核对收款后调用）
 */
export async function confirmOrder(id: string): Promise<Order | null> {
  const orders = await readAll();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;

  // 生成下载Token：24小时有效
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  orders[idx] = {
    ...orders[idx],
    status: "confirmed",
    downloadToken: token,
    downloadExpiresAt: expiresAt,
    confirmedAt: new Date().toISOString(),
  };
  await writeAll(orders);
  return orders[idx];
}

export async function markDelivered(id: string): Promise<Order | null> {
  const orders = await readAll();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  orders[idx] = {
    ...orders[idx],
    status: "delivered",
    deliveredAt: new Date().toISOString(),
  };
  await writeAll(orders);
  return orders[idx];
}

export async function findOrderByToken(token: string): Promise<Order | null> {
  const orders = await readAll();
  const order = orders.find((o) => o.downloadToken === token);
  if (!order) return null;
  if (order.downloadExpiresAt && new Date(order.downloadExpiresAt) < new Date()) {
    return null; // 已过期
  }
  return order;
}
