#!/usr/bin/env node
/**
 * 发布前构建脚本 - 自动生成加密配置
 *
 * 使用方法：
 *   BUILTIN_API_KEY="nvapi-xxx" BUILTIN_MODEL="kimi-k2.5" npm run prepack
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 加密密钥（必须与主程序一致）
const SECRET_KEY = "openclaw-easy-secret-2026";

// XOR 加密
function xorEncrypt(text, key) {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(
      text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return result;
}

// 加密流程：XOR → base64
function encrypt(str) {
  const xored = xorEncrypt(str, SECRET_KEY);
  return Buffer.from(xored, "utf8").toString("base64");
}

// 从环境变量读取真实配置
const apiKey = process.env.BUILTIN_API_KEY;
const model = process.env.BUILTIN_MODEL || "kimi-k2.5";

if (!apiKey) {
  console.error("\n错误: 未设置 BUILTIN_API_KEY 环境变量");
  console.error("\n使用方法：");
  console.error("  BUILTIN_API_KEY=\"nvapi-xxx\" npm run prepack");
  console.error("  或");
  console.error("  BUILTIN_API_KEY=\"nvapi-xxx\" BUILTIN_MODEL=\"kimi-k2.5\" npm publish\n");
  process.exit(1);
}

// 真实配置（发布到 npm 的福利配置）
const REAL_CONFIG = {
  d: encrypt(apiKey),
  m: encrypt(model),
  v: "1"
};

const configPath = path.join(__dirname, "../lib/config.json");

// 写入加密配置
fs.writeFileSync(configPath, JSON.stringify(REAL_CONFIG, null, 2));

console.log("✓ 已生成加密配置 lib/config.json");
console.log("✓ 加密方式: XOR + base64");
console.log("⚠️  此文件不应提交到 GitHub");
