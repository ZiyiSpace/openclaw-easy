# Windows 用户使用指南

> **openclaw-easy 在 Windows 原生环境下的使用说明**

---

## 为什么体验不同？

OpenClaw 的守护进程功能依赖 Unix 系统（macOS/Linux）：

| 功能 | macOS/Linux | Windows 原生 |
|------|-------------|--------------|
| 守护进程 | ✅ systemd/launchd | ❌ 不支持 |
| 后台运行 | ✅ 自动后台 | ❌ 需要窗口 |
| 开机自启 | ✅ 自动启动 | ❌ 需要手动 |
| 稳定程度 | ✅ 官方支持 | ⚠️ 实验性 |

---

## Windows 使用方式

### 方式一：原生 Windows（简单但功能受限）

#### 安装配置

```bash
npm install -g "@zi.yi/openclaw-easy@latest"
openclaw-easy
```

#### 手动启动（需要两个终端）

**终端 1 - 启动 Gateway**
```bash
npx openclaw gateway
```

⚠️ **此窗口必须保持开启**，关闭会停止服务

**终端 2 - 打开控制面板**
```bash
npx openclaw dashboard
```

#### 使用说明

- Gateway 窗口不能最小化或关闭
- 每次开机都需要重复上述步骤
- 适合临时使用，不推荐长期使用

---

### 方式二：WSL2（推荐，完整体验）

WSL2 是 Windows 上运行 Linux 的官方方式，可以获得和 macOS 相同的体验。

#### 检查 WSL2 是否已安装

```powershell
wsl --list --verbose
```

如果看到 Ubuntu 或其他 Linux 发行版，说明已安装。

#### 安装 WSL2（如果未安装）

```powershell
# 以管理员身份运行 PowerShell
wsl --install
```

安装完成后重启电脑。

#### 在 WSL2 中使用

```bash
# 进入 WSL2 终端
wsl

# 安装和使用
npm install -g @zi.yi/openclaw-easy
openclaw-easy

# 后续使用与 macOS 相同
npx openclaw dashboard
```

#### WSL2 优势

- ✅ 守护进程自动后台运行
- ✅ 关闭终端不影响服务
- ✅ 开机自动启动
- ✅ 完整功能支持

---

## 常见问题

### Q: Windows 原生运行时提示缺少模块？

A: 某些 OpenClaw 功能依赖 Unix 环境，Windows 原生支持有限。建议使用 WSL2。

### Q: Gateway 启动后很快自动关闭？

A: 可能是配置错误，运行 `npx openclaw doctor` 检查环境。

### Q: 能否让 Gateway 在 Windows 后台运行？

A: Windows 原生无法实现真正的后台服务。可以尝试使用 PM2：

```bash
npm install -g pm2
pm2 start npx --name "openclaw-gateway" -- openclaw gateway
pm2 save
pm2 startup
```

但这种方式不被官方支持，可能存在兼容性问题。

### Q: 推荐哪个方式？

A:
- **临时测试** → Windows 原生
- **长期使用** → WSL2
- **生产环境** → WSL2

---

## WSL2 快速安装指南

### 1. 启用 WSL2

```powershell
# 以管理员身份运行 PowerShell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

### 2. 下载 WSL2 Linux 内核更新

访问：https://aka.ms/wsl2kernel

下载后双击安装。

### 3. 设置 WSL2 为默认

```powershell
wsl --set-default-version 2
```

### 4. 安装 Ubuntu

```powershell
wsl --install -d Ubuntu
```

### 5. 在 WSL2 中使用

```bash
# 进入 Ubuntu
wsl

# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js (如果没有)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 使用 openclaw-easy
npm install -g @zi.yi/openclaw-easy
openclaw-easy
```

---

## 对比总结

| 特性 | Windows 原生 | WSL2 |
|------|-------------|------|
| 安装难度 | ⭐ 简单 | ⭐⭐⭐ 需要配置 |
| 守护进程 | ❌ 无 | ✅ 有 |
| 后台运行 | ❌ 需要开窗口 | ✅ 真后台 |
| 开机自启 | ❌ 需手动 | ✅ 自动 |
| 功能完整度 | ⭐⭐ 有限 | ⭐⭐⭐⭐⭐ 完整 |
| 官方支持 | ⚠️ 实验性 | ✅ 推荐方式 |

---

**推荐：Windows 用户使用 WSL2 获得最佳体验！** 🦞
