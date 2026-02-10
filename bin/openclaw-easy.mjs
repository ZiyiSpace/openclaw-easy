#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { createInterface } from "node:readline";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 内部密钥（混淆）
const _k = "openclaw-easy-secret-2026";
const _0 = "d";
const _1 = "m";
const _2 = "v";

// 解密函数（与加密工具对应）
const _d = (s) => {
  try {
    const b = Buffer.from(s, "base64").toString("utf8");
    let r = "";
    for (let i = 0; i < b.length; i++) {
      r += String.fromCharCode(b.charCodeAt(i) ^ _k.charCodeAt(i % _k.length));
    }
    return r;
  } catch (_) {
    return "";
  }
};

// 获取内置配置
function getBuiltinConfig() {
  try {
    const configPath = path.join(__dirname, "../lib/config.json");
    const raw = fs.readFileSync(configPath, "utf8");
    const _c = JSON.parse(raw);

    return {
      apiKey: _d(_c[_0]),
      model: _d(_c[_1]),
      version: _c[_2]
    };
  } catch (err) {
    console.error("Configuration error. Please reinstall:\n  npm install -g @hzzzzzz/openclaw-easy");
    process.exit(1);
  }
}

// 交互式询问
function askQuestion(query) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

const arg = (name) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
};

// 主流程
async function main() {
  const builtinConfig = getBuiltinConfig();
  const userApiKey = arg("--openai-key") || process.env.OPENAI_API_KEY;

  let finalApiKey;
  let finalModel = builtinConfig.model;

  if (userApiKey) {
    console.log("\n检测到你提供了自己的 API key。");
    console.log("  [1] 使用你自己的 API key");
    console.log("  [2] 使用内置的福利 API key（%s)", builtinConfig.model);

    const choice = await askQuestion("\n请选择 [1/2]（默认 1）：");

    if (choice === "2" || choice === "内置" || choice === "福利") {
      finalApiKey = builtinConfig.apiKey;
      console.log("\n✓ 使用内置福利 API key");
    } else {
      finalApiKey = userApiKey;
      console.log("\n✓ 使用你提供的 API key");
    }
  } else {
    finalApiKey = builtinConfig.apiKey;
    console.log("\n✓ 使用内置福利 API key (%s)", builtinConfig.model);
  }

  // 写入配置文件
  const envFile = path.join(os.homedir(), ".openclaw", ".env");
  fs.mkdirSync(path.dirname(envFile), { recursive: true });

  const lines = fs.existsSync(envFile) ? fs.readFileSync(envFile, "utf8").split(/\r?\n/) : [];
  const next = lines.filter((line) => !line.startsWith("OPENAI_API_KEY=") && !line.startsWith("OPENCLAW_MODEL="));
  next.push(`OPENAI_API_KEY=${finalApiKey}`);
  next.push(`OPENCLAW_MODEL=${finalModel}`);
  fs.writeFileSync(envFile, `${next.filter(Boolean).join("\n")}\n`, "utf8");

  // 调用 OpenClaw
  const openclawCli = require.resolve("openclaw/cli-entry");
  const run = spawnSync(
    process.execPath,
    [
      openclawCli,
      "onboard",
      "--non-interactive",
      "--accept-risk",
      "--flow",
      "quickstart",
      "--auth-choice",
      "openai-api-key",
      "--install-daemon"
    ],
    { stdio: "inherit", env: { ...process.env, OPENAI_API_KEY: finalApiKey, OPENCLAW_MODEL: finalModel } }
  );

  process.exit(run.status ?? 1);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
