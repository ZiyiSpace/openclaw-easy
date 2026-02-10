# @zi.yi/openclaw-easy

[![npm version](https://badge.fury.io/js/@hzzzzzz%2Fopenclaw-easy.svg)](https://www.npmjs.com/package/@zi.yi/openclaw-easy)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Install Size](https://packagephobia.com/badge?p=@zi.yi/openclaw-easy)](https://packagephobia.com/result?p=@zi.yi/openclaw-easy)

> **One-command setup for [OpenClaw](https://github.com/anthropics/openclaw) with built-in API key.**

OpenClaw 是一个自托管 AI 助手网关，可以连接 WhatsApp、Telegram、Discord 等聊天应用到 AI 编码助手。这个工具让你一键完成配置，内置免费 OpenRouter 模型。

## 特点

- **零配置** - 内置免费 API key，开箱即用
- **灵活** - 可以选择使用自己的 API key
- **一键安装** - 一条命令完成所有配置
- **安全** - API key 加密存储

## 快速开始

### 安装

```bash
npm install -g @zi.yi/openclaw-easy
```

### 使用

**方式一：使用内置福利 API key（推荐）**

```bash
openclaw-easy
```

默认配置：
- 模型：`arcee-ai/trinity-large-preview:free`（通过 zai provider）

**方式二：使用自己的 API key**

```bash
# 命令行参数
openclaw-easy --openai-key sk-your-api-key-here

# 或环境变量
export OPENAI_API_KEY=sk-your-api-key-here
openclaw-easy
```

安装完成后，你可以通过以下方式与 OpenClaw 交互：

```bash
# 打开 Web 控制面板
npx openclaw dashboard

# 或使用终端界面
npx openclaw tui

# 或直接发送消息
npx openclaw agent --message "你好"
```

## 工作原理

1. 从内置配置或用户输入获取 API key
2. 将配置写入 `~/.openclaw/.env`（API key、模型）
3. 运行 OpenClaw 的 onboarding 流程
4. 安装并启动 OpenClaw 守护进程

## 常见问题

### Q: 内置的是什么模型？

A: 内置的是 OpenRouter Trinity 模型（通过 zai provider），适合日常使用。

### Q: 如何更换模型？

A: 编辑 `~/.openclaw/.env`，修改 `OPENCLAW_MODEL` 环境变量。

### Q: 卸载怎么办？

```bash
npm uninstall -g @zi.yi/openclaw-easy
npx openclaw uninstall  # 完全卸载 OpenClaw
```

## 文档

详细使用指南请查看 [USER_GUIDE.md](USER_GUIDE.md)

## 开发

```bash
# 克隆仓库
git clone https://github.com/ZiyiSpace/openclaw-easy.git
cd openclaw-easy

# 安装依赖
npm install

# 本地测试
npm install -g .
openclaw-easy

# 发布到 npm（需要设置环境变量）
BUILTIN_API_KEY="your-api-key" BUILTIN_MODEL="arcee-ai/trinity-large-preview:free" npm publish --access public
```

## 致谢

- [OpenClaw](https://github.com/anthropics/openclaw) - 核心项目
- [OpenRouter](https://openrouter.ai/) - 提供 API 支持

## GitHub 仓库

https://github.com/ZiyiSpace/openclaw-easy

## License

[MIT](LICENSE) © 2026 王子怡 (Ziyi Wang)
