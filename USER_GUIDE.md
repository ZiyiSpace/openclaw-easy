# @zi.yi/openclaw-easy 快速上手

**三步配置你的 AI 助手**

---

## 第一步：安装

```bash
npm install -g "@zi.yi/openclaw-easy@latest"
```

---

## 第二步：运行

```bash
openclaw-easy
```

看到这个就成功了：
```
✓ 配置完成！Gateway 正在自动启动...
```

---

## 第三步：开始对话

```bash
npx openclaw dashboard
```

浏览器会自动打开，直接在网页里发消息即可！

---

## 常用命令

| 命令 | 功能 |
|------|------|
| `npx openclaw dashboard` | 打开对话界面 |
| `npx openclaw tui` | 终端内对话 |
| `npx openclaw agent --message "xxx"` | 直接发消息 |
| `npx openclaw status` | 查看状态 |
| `npx openclaw logs` | 查看日志 |

---

## 使用自己的 API Key（可选）

```bash
openclaw-easy --openai-key sk-你的key
```

---

## 内置配置

- 模型：`arcee-ai/trinity-large-preview:free` (OpenRouter)
- 完全免费，开箱即用

---

## 平台说明

### macOS / Linux

配置完成后自动启动守护进程，开机自启，无需手动干预。

### Windows

配置完成后 **Gateway 会自动启动**（版本 1.0.6+）：

```bash
# 终端1：自动运行中（保持开启）
# Gateway 已在运行，无需手动启动

# 打开新终端，运行控制面板
npx openclaw dashboard
```

⚠️ **Gateway 终端窗口不能关闭**，关闭会停止服务。

💡 **推荐**：Windows 用户使用 WSL2 获得完整体验，详见 [Windows 使用手册](windows-使用手册.md)

---

## 删除 / 重装

**完全卸载（重新安装前执行）：**
```bash
# 停止服务
launchctl bootout gui/$(id -u)/ai.openclaw.gateway 2>/dev/null
rm -f ~/Library/LaunchAgents/com.openclaw.gateway.plist

# 清理配置
rm -rf ~/.openclaw

# 卸载 npm 包
npm uninstall -g @zi.yi/openclaw-easy
```

**卸载 OpenClaw（保留 npm 包）：**
```bash
# 完全卸载 OpenClaw
npx openclaw uninstall
```

---

## 遇到问题？

**发消息没反应？**
1. 确认浏览器打开了完整 URL（包含 token）
2. 运行 `npx openclaw status` 检查服务
3. 运行 `npx openclaw logs` 查看日志

**重启服务：**
```bash
launchctl bootout gui/$(id -u)/ai.openclaw.gateway 2>/dev/null
launchctl load ~/Library/LaunchAgents/ai.openclaw.gateway.plist 2>/dev/null
```

**卸载：**
```bash
npm uninstall -g @zi.yi/openclaw-easy
npx openclaw uninstall
```

---

**就这样，开始用吧！** 🦞
