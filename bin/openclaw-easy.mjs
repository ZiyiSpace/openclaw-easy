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

// 平台检测
const isWindows = process.platform === 'win32';
const isMac = process.platform === 'darwin';
const isLinux = process.platform === 'linux';

// 内部密钥（混淆）
const _k = "openclaw-easy-secret-2026";
const _0 = "d";  // API key
const _1 = "m";  // model
const _2 = "v";  // version

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

// 更新 OpenClaw 配置文件，设置模型
function updateOpenClawConfig(model) {
  const configPath = path.join(os.homedir(), ".openclaw", "openclaw.json");

  try {
    if (!fs.existsSync(configPath)) {
      return;
    }

    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

    // 模型 provider 映射
    let modelKey;
    if (model.includes("trinity")) {
      modelKey = `openrouter/${model}`;
    } else if (model.startsWith("glm")) {
      modelKey = `zai/glm-4-flash`;
    } else if (model.startsWith("gpt")) {
      modelKey = `openai/${model}`;
    } else {
      modelKey = model;
    }

    config.agents = config.agents || {};
    config.agents.defaults = config.agents.defaults || {};
    config.agents.defaults.models = {
      [modelKey]: {
        "alias": modelKey.includes("trinity") ? "Trinity" : modelKey.startsWith("zai") ? "GLM" : "GPT"
      }
    };
    config.agents.defaults.model = {
      "primary": modelKey
    };

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log("\n✓ 已使用内置免费模型");
  } catch (err) {
    console.error("警告: 无法更新 OpenClaw 配置:", err.message);
  }
}

// 主流程
async function main() {
  const builtinConfig = getBuiltinConfig();
  const userApiKey = arg("--openai-key") || process.env.OPENAI_API_KEY;

  let finalApiKey;
  let finalModel = builtinConfig.model;

  if (userApiKey) {
    console.log("\n检测到你提供了自己的 API key。");
    console.log("  [1] 使用你自己的 API key");
    console.log("  [2] 使用内置的免费 API key");

    const choice = await askQuestion("\n请选择 [1/2]（默认 1）：");

    if (choice === "2" || choice === "内置" || choice === "福利") {
      finalApiKey = builtinConfig.apiKey;
      console.log("\n✓ 使用内置福利 API key");
    } else {
      finalApiKey = userApiKey;
      console.log("\n✓ 使用你提供的 API key");
      // 用户用自己的 key，不强制使用内置模型配置
      finalModel = null;
    }
  } else {
    finalApiKey = builtinConfig.apiKey;
    console.log("\n✓ 使用内置免费 API key");
  }

  // 写入 .env 文件
  const envFile = path.join(os.homedir(), ".openclaw", ".env");
  fs.mkdirSync(path.dirname(envFile), { recursive: true });

  const lines = fs.existsSync(envFile) ? fs.readFileSync(envFile, "utf8").split(/\r?\n/) : [];

  // 过滤掉旧的配置行（包括看起来像是 API key 延续的行）
  const next = [];
  let skipNext = false;
  for (const line of lines) {
    if (skipNext) {
      skipNext = false;
      continue;
    }
    if (line.startsWith("OPENAI_API_KEY=") ||
        line.startsWith("OPENROUTER_API_KEY=") ||
        line.startsWith("ZAI_API_KEY=") ||
        line.startsWith("OPENCLAW_MODEL=")) {
      // 如果这行以 = 结尾但没有内容，可能是换行的 key，跳过下一行
      if (line.endsWith("=") || line.match(/KEY=$/)) {
        skipNext = true;
      }
      continue;
    }
    // 跳过看起来像是 API key 延续的行（不以 = 开头且像 base64/key 格式）
    if (line.match(/^[a-zA-Z0-9_-]{20,}$/) && !line.includes("=")) {
      continue;
    }
    next.push(line);
  }

  // 根据模型选择对应的环境变量
  if (finalModel && finalModel.includes("trinity")) {
    next.push(`OPENROUTER_API_KEY=${finalApiKey}`);
    next.push(`OPENCLAW_MODEL=openrouter/${finalModel}`);
  } else if (finalModel && finalModel.startsWith("glm")) {
    next.push(`ZAI_API_KEY=${finalApiKey}`);
    next.push(`OPENCLAW_MODEL=zai/glm-4-flash`);
  } else {
    next.push(`OPENAI_API_KEY=${finalApiKey}`);
    if (finalModel) {
      next.push(`OPENCLAW_MODEL=${finalModel}`);
    }
  }
  fs.writeFileSync(envFile, `${next.filter(Boolean).join("\n")}\n`, "utf8");

  // 调用 OpenClaw onboard
  const openclawCli = require.resolve("openclaw/cli-entry");

  // 根据模型选择认证方式和 API key 参数
  let authChoice = "openai-api-key";
  let apiKeyParam = "--openai-api-key";

  if (finalModel && finalModel.includes("trinity")) {
    authChoice = "openrouter-api-key";
    apiKeyParam = "--openrouter-api-key";
  } else if (finalModel && finalModel.startsWith("glm")) {
    authChoice = "zai-api-key";
    apiKeyParam = "--zai-api-key";
  }

  // 构建命令参数
  const args = [
    openclawCli,
    "onboard",
    "--non-interactive",
    "--accept-risk",
    "--flow",
    "quickstart",
    "--auth-choice",
    authChoice,
    apiKeyParam,
    finalApiKey,
  ];

  // 仅在非 Windows 平台安装守护进程
  if (!isWindows) {
    args.push("--install-daemon");
  }

  const run = spawnSync(
    process.execPath,
    args,
    {
      stdio: "inherit",
      env: {
        ...process.env,
        ...(finalModel && {
          OPENCLAW_MODEL: finalModel.includes("trinity")
            ? `openrouter/${finalModel}`
            : finalModel.startsWith("glm")
            ? "zai/glm-4-flash"
            : finalModel
        })
      }
    }
  );

  // 如果使用内置配置，更新 openclaw.json
  if (finalModel && run.status === 0) {
    updateOpenClawConfig(finalModel);

    if (isWindows) {
      // Windows：手动启动提示
      console.log("\n✓ 配置完成！");
      console.log("\n" + "=".repeat(50));
      console.log("Windows 用户请手动启动：");
      console.log("=".repeat(50));
      console.log("\n【第一步】在当前终端启动 Gateway：");
      console.log("  npx openclaw gateway");
      console.log("\n⚠️  请保持此终端窗口开启，关闭会停止服务");
      console.log("\n【第二步】打开新的终端，启动控制面板：");
      console.log("  npx openclaw dashboard");
      console.log("\n" + "=".repeat(50));
      console.log("💡 提示：推荐使用 WSL2 获得完整的后台运行体验");
      console.log("=".repeat(50) + "\n");
    } else {
      // macOS/Linux：自动重启
      console.log("\n正在重启 OpenClaw Gateway...");
      spawnSync(
        process.execPath,
        [openclawCli, "gateway", "--stop"],
        { stdio: "inherit" }
      );
      console.log("\n✓ 配置完成！Gateway 正在自动启动...");
      console.log("\n运行以下命令打开控制面板：");
      console.log("  npx openclaw dashboard");
    }
  }

  process.exit(run.status ?? 1);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
