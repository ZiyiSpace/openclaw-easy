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

**看到这个就成功了：**

```
✓ 使用内置免费 API key
Updated ~/.openclaw/openclaw.json
Workspace OK: ~/.openclaw/workspace
Sessions OK: ~/.openclaw/agents/main/sessions
✓ 已使用内置免费模型

[macOS/Linux]
正在重启 OpenClaw Gateway...
✓ 配置完成！Gateway 正在自动启动...

运行以下命令打开控制面板：
  npx openclaw dashboard

[Windows]
==================================================
                    ✅ 配置完成！
==================================================

正在启动 OpenClaw Gateway...
⚠️  请保持此窗口开启，关闭会停止服务

打开新终端，运行以下命令打开控制面板：
  npx openclaw dashboard

==================================================
```

---

## 第三步：开始对话

### macOS / Linux

```bash
npx openclaw dashboard
```

**Gateway 自动在后台运行**，关闭终端也不影响。

### Windows

**打开新的 PowerShell 窗口：**

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
# 命令行参数
openclaw-easy --openai-key sk-your-api-key-here

# 或环境变量
export OPENAI_API_KEY=sk-your-api-key-here
openclaw-easy
```

系统会提示你选择：

```
检测到你提供了自己的 API key。
  [1] 使用你自己的 API key
  [2] 使用内置的免费 API key

请选择 [1/2]（默认 1）：
```

---

## 内置配置

- **模型**：`arcee-ai/trinity-large-preview:free` (OpenRouter Trinity)
- **提供商**：OpenRouter
- **完全免费**，开箱即用

---

## 平台说明

### macOS / Linux

配置完成后自动启动守护进程，开机自启，无需手动干预。

**运行 `npx openclaw status` 可查看服务状态。**

### Windows

**版本 1.0.6+ 会自动启动 Gateway**：

```
✅ 配置完成！
正在启动 OpenClaw Gateway...
```

- **终端 1**：Gateway 自动运行中（保持开启）
- **终端 2**：打开控制面板

```
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
npm uninstall -g "@zi.yi/openclaw-easy"
```

**卸载 OpenClaw（保留 npm 包）：**

```bash
# 完全卸载 OpenClaw
npx openclaw uninstall
```

---

## 更新到最新版本

```bash
npm install -g "@zi.yi/openclaw-easy@latest"
```

---

## 遇到问题？

### Windows 安装时出现 node-llama-cpp 错误？

如果安装时看到类似 `node-llama-cpp postinstall error 3221225477` 的错误：

```powershell
# 使用 --ignore-scripts 跳过本地模型组件安装
npm install -g "@zi.yi/openclaw-easy@latest" --ignore-scripts
```

**这不影响使用！** `node-llama-cpp` 仅用于本地模型推理，使用云端 API（如内置的 Trinity 模型）不需要它。

---

**发消息没反应？**

1. 确认浏览器打开了完整 URL（包含 token）
2. 运行 `npx openclaw status` 检查服务
3. 运行 `npx openclaw logs` 查看日志

**重启服务（macOS/Linux）：**

```bash
launchctl bootout gui/$(id -u)/ai.openclaw.gateway 2>/dev/null
launchctl load ~/Library/LaunchAgents/ai.openclaw.gateway.plist 2>/dev/null
```

**卸载：**

```bash
npm uninstall -g "@zi.yi/openclaw-easy"
npx openclaw uninstall
```

---

**就这样，开始用吧！** 🦞
