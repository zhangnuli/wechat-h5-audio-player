# 🎵 示例代码

这里提供了 WeChat H5 Audio Player 的各种使用示例，帮助你快速上手和深入了解各种功能。

## 📁 目录结构

```
examples/
├── basic/                 # 基础示例
│   ├── 01-simple-autoplay.html      # 最简单的自动播放
│   ├── 02-background-music.html     # 背景音乐
│   ├── 03-sound-effects.html        # 音效播放
│   └── 04-with-controls.html        # 带控制器的播放器
├── advanced/              # 高级示例
│   ├── 01-multiple-players.html     # 多播放器管理
│   ├── 02-playlist.html             # 播放列表
│   ├── 03-visualizer.html           # 可视化效果
│   └── 04-game-audio.html           # 游戏音频
└── frameworks/            # 框架集成
    ├── vue/              # Vue.js 示例
    ├── react/            # React 示例
    └── vanilla-js/       # 原生JS示例
```

## 🚀 快速开始

### 1. 基础示例

最简单的自动播放示例：

```bash
# 打开基础示例
open examples/basic/01-simple-autoplay.html
```

### 2. 高级功能

多播放器管理示例：

```bash
# 打开高级示例
open examples/advanced/01-multiple-players.html
```

### 3. 框架集成

Vue.js 集成示例：

```bash
# 进入Vue示例目录
cd examples/frameworks/vue
npm install
npm run dev
```

## 📱 移动端测试

所有示例都针对移动端优化，建议在以下环境测试：

1. **微信环境** - 主要目标环境，支持自动播放
2. **iOS Safari** - 需要用户交互才能播放
3. **Android Chrome** - 需要用户交互才能播放

## 🔧 本地服务器

如果需要在本地测试，推荐使用简单的HTTP服务器：

```bash
# 使用Python启动服务器
python -m http.server 8000

# 或使用Node.js
npx serve .

# 或使用live-server
npx live-server
```

然后访问 `http://localhost:8000/examples/` 查看示例。

## 📝 注意事项

1. **HTTPS要求** - 微信环境需要HTTPS才能正常自动播放
2. **音频文件** - 示例中使用的是公开可用的测试音频
3. **调试模式** - 所有示例都启用了debug模式，便于查看日志
4. **错误处理** - 每个示例都包含完整的错误处理逻辑

## 🆘 问题反馈

如果在运行示例时遇到问题，请：

1. 检查浏览器控制台的错误信息
2. 确认音频文件可以正常访问
3. 查看 [故障排除文档](../docs/TROUBLESHOOTING.md)
4. 提交 [GitHub Issue](https://github.com/zhangnuli/wechat-h5-audio-player/issues)