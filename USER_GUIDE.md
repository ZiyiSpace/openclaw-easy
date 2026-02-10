# @hzzzzzz/openclaw-easy 用户指南

**一键配置 OpenClaw AI 助手，内置免费 API key，开箱即用！**

---

## 什么是 OpenClaw？

OpenClaw 是一个**自托管 AI 助手网关**，可以连接你常用的聊天应用到 AI 编码助手。

### 核心功能

| 功能 | 说明 |
|------|------|
| 多平台支持 | WhatsApp、Telegram、Discord、iMessage 等 |
| AI 编码助手 | 代码生成、调试、解释、重构 |
- 自托管 | 数据在自己机器上，安全可控 |
| 会话记忆 | 记住上下文，持续对话 |
| 工具调用 | 执行命令、搜索网络、操作浏览器 |

---

## 快速开始

### 1. 安装

```bash
npm install -g @hzzzzzz/openclaw-easy
```

### 2. 初始化配置

```bash
openclaw-easy
```

输出示例：
```
✓ 使用内置福利 API key (kimi-k2.5)

🦞 OpenClaw 2026.2.9
   Your AI assistant, now without the $3,499 headset.

Saved OPENAI_API_KEY to ~/.openclaw/.env
Installed LaunchAgent
...
```

**就这么简单！** OpenClaw 已配置完成。

---

## 使用方式

### 方式一：Web 控制面板（推荐）

```bash
npx openclaw dashboard
```

浏览器会自动打开 `http://127.0.0.1:18789/`，在网页界面中对话。

### 方式二：终端界面

```bash
npx openclaw tui
```

在终端中直接对话。

### 方式三：命令行对话

```bash
npx openclaw agent --message "帮我写一个快速排序算法"
```

### 方式四：连接聊天应用

配置后，可以直接在 WhatsApp、Telegram 等应用中对话。

---

## 高级用法

### 使用自己的 API Key

如果你有自己的 API key，可以这样使用：

```bash
# 命令行参数
openclaw-easy --openai-key sk-your-key-here

# 或环境变量
export OPENAI_API_KEY=sk-your-key-here
openclaw-easy
```

系统会提示你选择：
```
检测到你提供了自己的 API key。
  [1] 使用你自己的 API key
  [2] 使用内置的福利 API key（kimi-k2.5）

请选择 [1/2]（默认 1）：
```

### 查看所有命令

```bash
npx openclaw --help
```

### 常用命令

| 命令 | 说明 |
|------|------|
| `npx openclaw dashboard` | 打开 Web 控制面板 |
| `npx openclaw tui` | 终端界面 |
| `npx openclaw agent --message "xxx"` | 发送单条消息 |
| `npx openclaw status` | 查看状态 |
| `npx openclaw sessions` | 查看会话历史 |
| `npx openclaw logs` | 查看日志 |

---

## 配置文件

配置文件位置：`~/.openclaw/openclaw.json`

### 示例配置

```json
{
  "channels": {
    "whatsapp": {
      "allowFrom": ["+8613800138000"]
    }
  },
  "messages": {
    "groupChat": {
      "mentionPatterns": ["@openclaw"]
    }
  }
}
```

---

## 常见问题

### Q: 内置的 API key 有限制吗？

A: 内置的是 Kimi AI (kimi-k2.5) 模型，适合日常使用。如需更高性能，建议使用自己的 API key。

### Q: 如何更换模型？

A: 编辑 `~/.openclaw/.env`，修改 `OPENCLAW_MODEL` 环境变量。

### Q: 守护进程怎么管理？

```bash
# 查看状态
npx openclaw status

# 重启
npx openclaw gateway --restart

# 停止
npx openclaw gateway --stop
```

### Q: 卸载怎么办？

```bash
npm uninstall -g @hzzzzzz/openclaw-easy
npx openclaw uninstall  # 完全卸载 OpenClaw
```

---

## 项目信息

- **包名**: `@hzzzzzz/openclaw-easy`
- **作者**: 王子怡 (Ziyi Wang)
- **GitHub**: https://github.com/hzzzzz-1
- **OpenClaw 官方文档**: https://docs.openclaw.ai

---

## 许可证

MIT License

---

**享受你的 AI 助手吧！** 🦞
