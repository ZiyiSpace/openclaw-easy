#!/usr/bin/env node
/**
 * 配置加密工具 - 加强版
 * 使用 XOR 加密 + base64 编码
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 加密密钥（嵌入代码中）
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

// 从命令行获取参数
const args = process.argv.slice(2);
const apiKey = args[0];
const model = args[1] || "kimi-k2.5";

if (!apiKey) {
  console.log("\n配置加密工具（加强版）\n");
  console.log("使用方法：");
  console.log("  node scripts/encrypt-config.mjs <api-key> [model]");
  console.log("\n示例：");
  console.log("  node scripts/encrypt-config.mjs nvapi-xxxxx kimi-k2.5");
  process.exit(1);
}

// 生成加密配置
const config = {
  d: encrypt(apiKey),      // 'd' for data (obfuscated name)
  m: encrypt(model),       // 'm' for model
  v: "1"                   // version
};

// 输出结果
console.log("\n=== 加密后的配置（XOR + base64）===\n");
console.log(JSON.stringify(config, null, 2));
console.log("\n====================\n");

// 写入配置文件
const configPath = path.join(__dirname, "../lib/config.json");
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

console.log("✓ 已更新 lib/config.json");
console.log(`✓ 配置文件路径: ${configPath}`);
console.log("✓ 加密方式: XOR + base64");
