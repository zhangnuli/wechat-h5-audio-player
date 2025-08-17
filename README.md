# 🎵 WeChat H5 Audio Player

[![npm version](https://badge.fury.io/js/wechat-h5-audio-player.svg)](https://badge.fury.io/js/wechat-h5-audio-player)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/zhangnuli/wechat-h5-audio-player)
[![Bundle Size](https://img.shields.io/badge/gzip%20size-97KB-blue.svg)](https://bundlephobia.com/package/wechat-h5-audio-player)

> 🎯 **企业级微信H5音频自动播放解决方案 - 真正的零外部依赖**

专为微信H5环境设计的高性能音频播放器库，基于SoundJS + WeixinJSBridgeReady技术栈，支持iOS和Android微信环境的**真正无交互自动播放**。内置SoundJS库，开箱即用，无需CDN依赖。

## ✨ 核心特性

### 🚀 **自动播放技术**
- **真正的微信自动播放** - 基于WeixinJSBridgeReady + SoundJS技术栈
- **零用户交互** - iOS/Android微信环境无需任何点击即可播放
- **智能环境适配** - 自动检测并适配不同浏览器环境

### 📦 **零依赖架构** 
- **开箱即用** - npm install后直接使用，无需额外配置

### 🎯 **企业级品质**
- **TypeScript编写** - 完整类型定义，IDE友好
- **生产级稳定** - 完善的错误处理和状态管理  
- **性能优化** - 智能预加载和内存管理
- **全面测试** - 覆盖主流设备和浏览器环境

## 🚀 快速开始

### 📦 安装

```bash
# 使用 npm
npm install wechat-h5-audio-player

# 使用 yarn  
yarn add wechat-h5-audio-player

# 使用 pnpm
pnpm add wechat-h5-audio-player
```

### ⚡ 极简使用 

```typescript
import { WechatAudioPlayer } from 'wechat-h5-audio-player'

// 🎵 一行代码实现自动播放
const player = new WechatAudioPlayer({
  src: 'https://example.com/audio.mp3',
  autoplay: true  // 微信环境自动播放，零交互！
})
```

### 🎮 完整使用示例

```typescript
import { WechatAudioPlayer } from 'wechat-h5-audio-player'

// 创建播放器实例
const player = new WechatAudioPlayer({
  src: 'https://example.com/background-music.mp3',
  autoplay: true,           // 自动播放
  loop: true,              // 循环播放
  volume: 0.8,             // 初始音量
  muted: false,            // 是否静音
  debug: true,             // 开发环境启用调试
  
  // 🎯 事件回调
  onReady: () => {
    console.log('🎵 播放器准备就绪')
  },
  onPlay: () => {
    console.log('▶️ 开始播放')
  },
  onPause: () => {
    console.log('⏸️ 暂停播放') 
  },
  onEnded: () => {
    console.log('⏹️ 播放结束')
  },
  onError: (error) => {
    console.error('❌ 播放失败:', error.message)
  },
  onVolumeChange: (volume) => {
    console.log('🔊 音量变化:', Math.round(volume * 100) + '%')
  }
})

// 📱 播放控制
await player.play()        // 播放音频
player.pause()            // 暂停播放  
player.stop()             // 停止播放

// 🎚️ 音量控制
player.setVolume(0.5)     // 设置音量 50%
player.setMuted(true)     // 静音
player.getVolume()        // 获取当前音量

// 🔄 播放模式
player.setLoop(true)      // 开启循环
player.isLoop()           // 检查循环状态

// 📊 状态查询
const status = player.getStatus()
console.log({
  state: status.state,              // 播放状态
  isPlaying: status.isPlaying,      // 是否播放中
  currentTime: status.currentTime,  // 当前时间
  duration: status.duration,        // 总时长
  volume: status.volume,            // 音量
  loop: status.loop                 // 循环状态
})

// 🎧 事件监听
player.on('play', () => console.log('播放开始'))
player.on('timeupdate', (currentTime, duration) => {
  console.log(`播放进度: ${currentTime}/${duration}秒`)
})

// 🔧 生命周期管理
player.destroy()          // 销毁播放器，释放资源
```

### 🌍 环境检测

```typescript
// 获取环境信息
const status = player.getStatus()
const env = status.environment

console.log('运行环境:', {
  isWeixin: env.isWeixin,          // 是否微信环境
  isIOS: env.isIOS,                // 是否iOS
  isAndroid: env.isAndroid,        // 是否Android  
  supportsAutoplay: env.supportsAutoplay, // 是否支持自动播放
  browserType: env.browserType     // 浏览器类型
})
```

## 🎯 在线演示

我们提供了企业级演示页面，展示完整的自动播放功能：

### 📱 演示地址
- **演示页面**: `https://www.hdsite.com.cn/demos/demo/` 
- **功能展示**: 自动初始化 + 自动播放 + 状态监控

### 🎪 演示特性
- ✅ **智能环境检测** - 自动识别微信/Safari/Chrome等环境
- ✅ **零交互播放** - 微信环境下页面加载即开始播放
- ✅ **实时监控** - 播放状态、进度、音量等实时显示  
- ✅ **可视化效果** - 音频波形动画、播放器UI
- ✅ **错误处理** - 完整的错误信息和调试日志

### 🛠️ 本地运行演示

```bash
# 克隆项目
git clone https://github.com/zhangnuli/wechat-h5-audio-player.git
cd wechat-h5-audio-player

# 安装依赖并构建
npm install && npm run build

# 启动本地服务器
npm run serve
# 或直接打开 demo/index.html

# 微信环境测试
# 1. 部署到https服务器
# 2. 微信扫码访问测试自动播放
```

## 📚 配置选项

### WechatAudioConfig

```typescript
interface WechatAudioConfig {
  // 🎵 基础配置
  src: string                    // 音频文件URL（必需）
  autoplay?: boolean            // 自动播放，默认false
  loop?: boolean               // 循环播放，默认false
  volume?: number              // 音量 0-1，默认0.8
  muted?: boolean              // 静音状态，默认false
  
  // 🎛️ 高级配置  
  debug?: boolean              // 调试模式，默认false
  loadOptions?: AudioLoadOptions // 音频加载选项
  weixinConfig?: WeixinConfig    // 微信环境配置
  
  // 🎯 事件回调
  onReady?: () => void           // 播放器准备就绪
  onPlay?: () => void            // 开始播放
  onPause?: () => void           // 暂停播放
  onStop?: () => void            // 停止播放
  onEnded?: () => void           // 播放结束
  onError?: (error: Error) => void // 播放错误
  onVolumeChange?: (volume: number) => void // 音量变化
  onTimeUpdate?: (currentTime: number, duration: number) => void // 时间更新
}
```

### AudioLoadOptions

```typescript
interface AudioLoadOptions {
  id?: string                  // 音频ID，默认自动生成
  preload?: boolean           // 预加载，默认true
  formats?: string[]          // 支持格式，默认['mp3','ogg','wav']  
  timeout?: number            // 加载超时，默认10000ms
}
```

### WeixinConfig

```typescript
interface WeixinConfig {
  enableJSSDK?: boolean       // 启用微信JSSDK，默认false
  jssdkConfig?: {            // JSSDK配置（可选）
    appId: string
    timestamp: string  
    nonceStr: string
    signature: string
    jsApiList?: string[]
  }
}
```

```typescript
const player = new WechatAudioPlayer({
  src: 'https://example.com/background-music.mp3',
  autoplay: true,     // 关键：在微信环境下可以真正自动播放
  loop: true,         // 背景音乐通常需要循环
  volume: 0.6,        // 适中的音量
  debug: false,       // 生产环境关闭调试
  
  // 微信JSSDK配置（可选）
  weixinConfig: {
    enableJSSDK: true,
    jssdkConfig: {
      appId: 'your-app-id',
      timestamp: 'your-timestamp',
      nonceStr: 'your-nonce',
      signature: 'your-signature'
    }
  },
  
  // 事件回调
  onReady: () => {
    console.log('🎵 播放器准备就绪')
  },
  
  onPlay: () => {
    console.log('🎵 背景音乐开始播放')
    // 显示音乐图标动画等
  },
  
  onError: (error) => {
    console.error('🚫 音频播放失败:', error)
    // 错误处理逻辑
  }
})
```

## 🔧 API 参考

### 🏗️ 构造函数

```typescript
new WechatAudioPlayer(config: WechatAudioConfig)
```

### 🎮 实例方法

#### 播放控制
```typescript
// 🎵 播放音频
await player.play(): Promise<void>

// ⏸️ 暂停播放  
player.pause(): void

// ⏹️ 停止播放
player.stop(): void
```

#### 🔊 音量控制
```typescript  
// 设置音量 (0-1)
player.setVolume(volume: number): void

// 获取当前音量
player.getVolume(): number

// 设置静音状态
player.setMuted(muted: boolean): void

// 获取静音状态  
player.isMuted(): boolean
```

#### 🔄 播放模式
```typescript
// 设置循环播放
player.setLoop(loop: boolean): void

// 获取循环状态
player.isLoop(): boolean
```

#### 📊 状态查询
```typescript
// 获取当前播放时间（秒）
player.getCurrentTime(): number

// 获取音频总时长（秒）  
player.getDuration(): number

// 获取完整状态信息
player.getStatus(): PlayerStatus
```

#### 🎧 事件系统
```typescript
// 添加事件监听
player.on(event: string, listener: Function): void

// 移除事件监听
player.off(event: string, listener: Function): void

// 销毁播放器，释放资源
player.destroy(): void
```

### 📋 事件列表

| 事件名 | 参数 | 触发时机 | 描述 |
|--------|------|----------|------|
| `ready` | - | 播放器准备完成 | 音频加载完成，可以播放 |
| `play` | - | 开始播放 | 音频开始播放时触发 |
| `pause` | - | 暂停播放 | 音频暂停时触发 |
| `stop` | - | 停止播放 | 音频停止时触发 |
| `ended` | - | 播放结束 | 音频播放完成时触发 |
| `volumechange` | `volume: number` | 音量变化 | 音量设置改变时触发 |
| `timeupdate` | `currentTime: number` | 播放进度更新 | 播放时间更新时触发 |
| `error` | `error: Error` | 发生错误 | 播放过程中出现错误 |
| `statechange` | `state: PlayerState` | 状态变化 | 播放器状态改变时触发 |

### 🏷️ 类型定义

```typescript
// 播放器状态
type PlayerState = 'idle' | 'loading' | 'ready' | 'playing' | 'paused' | 'stopped' | 'error'

// 状态信息
interface PlayerStatus {
  state: PlayerState           // 当前状态
  isPlaying: boolean          // 是否正在播放
  volume: number              // 当前音量
  muted: boolean              // 是否静音
  loop: boolean               // 是否循环
  currentTime: number         // 当前播放时间（秒）
  duration: number            // 音频总时长（秒）
  loadProgress: number        // 加载进度 (0-1)
  environment: EnvironmentInfo // 环境信息
}

// 环境信息
interface EnvironmentInfo {
  isWeixin: boolean           // 是否微信环境
  isIOS: boolean              // 是否iOS设备
  isAndroid: boolean          // 是否Android设备
  isHTTPS: boolean            // 是否HTTPS协议
  supportsAutoplay: boolean   // 是否支持自动播放
  browserType: string         // 浏览器类型
  userAgent: string           // User Agent
  weixinVersion?: string      // 微信版本（如果是微信环境）
}
```

## 🎯 核心技术原理

### 🚀 微信自动播放突破技术

#### 技术栈架构
```
┌─────────────────────────────────────┐
│     Wechat H5 Audio Player          │
├─────────────────────────────────────┤
│  🎵 WechatAudioPlayer (业务层)      │
│  🔧 SoundJSBundle (适配层)          │
│  📦 SoundJS Library (音频引擎)      │
│  🌐 WeixinJSBridge (微信底层)       │
└─────────────────────────────────────┘
```

// 🎯 核心实现原理（简化版）
class WechatAudioPlayer {
  async setupWeixinEnvironment() {
    return new Promise(resolve => {
      if (window.WeixinJSBridge) {
        // 微信环境已就绪，直接加载
        this.loadAudio().then(resolve)
      } else {
        // 等待微信环境就绪
        document.addEventListener('WeixinJSBridgeReady', () => {
          this.loadAudio().then(resolve)
        }, false)
      }
    })
  }

  async loadAudio() {
    // 关键：在WeixinJSBridgeReady后注册音频
    window.createjs.Sound.registerSound(this.config.src, this.audioId)
    
    // 如果autoplay=true，立即播放（零交互！）
    if (this.config.autoplay) {
      const instance = window.createjs.Sound.play(this.audioId)
      // 🎉 iOS/Android微信都能正常播放！
    }
  }
}
```

### 📦 v1.0.1 重大架构升级

#### ✅ 真正零依赖架构
- **内置SoundJS** - 74KB优化打包，包含完整音频引擎
- **一键安装使用** - npm install即可，无需额外配置



## 🌍 环境兼容性

### 📱 支持矩阵

| 环境 | 自动播放 | 音量控制 | 循环播放 | 状态查询 | 推荐指数 |
|------|---------|---------|----------|----------|----------|
| **iOS 微信** | ✅ 完美 | ✅ 支持 | ✅ 支持 | ✅ 支持 | ⭐⭐⭐⭐⭐ |
| **Android 微信** | ✅ 完美 | ✅ 支持 | ✅ 支持 | ✅ 支持 | ⭐⭐⭐⭐⭐ |
| **iOS Safari** | ⚠️ 需交互 | ✅ 支持 | ✅ 支持 | ✅ 支持 | ⭐⭐⭐ |
| **Android Chrome** | ⚠️ 需交互 | ✅ 支持 | ✅ 支持 | ✅ 支持 | ⭐⭐⭐ |
| **桌面浏览器** | ⚠️ 部分支持 | ✅ 支持 | ✅ 支持 | ✅ 支持 | ⭐⭐⭐⭐ |

### 🎯 自动播放策略

```typescript
// 智能环境检测和播放策略
const player = new WechatAudioPlayer({
  src: 'audio.mp3',
  autoplay: true,
  debug: true  // 查看详细策略信息
})

// 获取当前环境和策略
const status = player.getStatus()
console.log('环境分析:', {
  环境类型: status.environment.browserType,
  是否微信: status.environment.isWeixin,
  自动播放支持: status.environment.supportsAutoplay,
  设备类型: status.environment.isIOS ? 'iOS' : 
           status.environment.isAndroid ? 'Android' : 'Desktop'
})
```

### 🔧 兼容性处理

```typescript
// 针对不同环境的最佳实践
const player = new WechatAudioPlayer({
  src: 'background-music.mp3',
  autoplay: true,
  
  // 成功回调
  onPlay: () => {
    console.log('🎵 自动播放成功')
    // 隐藏播放按钮等UI
    document.getElementById('playBtn').style.display = 'none'
  },
  
  // 失败回调 - 降级到用户交互
  onError: (error) => {
    console.log('⚠️ 自动播放失败，需要用户交互')
    // 显示播放按钮
    const playBtn = document.getElementById('playBtn')
    playBtn.style.display = 'block'
    playBtn.onclick = () => player.play()
  }
})
```

## 💡 最佳实践

### 🎵 背景音乐场景
```typescript
// 适用于H5游戏、活动页面等背景音乐
const bgMusic = new WechatAudioPlayer({
  src: 'https://cdn.example.com/bg-music.mp3',
  autoplay: true,    // 微信环境自动播放
  loop: true,        // 循环播放
  volume: 0.6,       // 适中音量避免打扰
  debug: false,      // 生产环境关闭调试
  
  onReady: () => console.log('🎵 背景音乐就绪'),
  onPlay: () => {
    // 显示音乐控制图标
    document.querySelector('.music-icon').classList.add('playing')
  }
})
```

### 🎯 音效播放场景  
```typescript
// 适用于按钮点击、消息提示等音效
const soundEffect = new WechatAudioPlayer({
  src: 'https://cdn.example.com/click-sound.wav',
  autoplay: false,   // 音效不自动播放
  volume: 0.8,       // 音效稍大声一些
  
  onPlay: () => console.log('🔊 音效播放'),
  onEnded: () => console.log('✅ 音效播放完成')
})

// 在需要的时候播放
document.querySelector('.btn').onclick = () => {
  soundEffect.play()
}
```

### 🎪 多媒体展示场景
```typescript
// 适用于产品介绍、宣传页面等
const presenter = new WechatAudioPlayer({
  src: 'https://cdn.example.com/presentation.mp3',
  autoplay: true,
  loop: false,       // 展示音频一般不循环
  volume: 0.9,
  
  onPlay: () => {
    // 开始展示动画
    startPresentationAnimation()
  },
  onEnded: () => {
    // 展示结束，显示操作按钮
    showActionButtons()
  }
})
```

## 📚 文档导航

### 📖 详细文档
- **[📋 API 参考手册](./docs/API.md)** - 完整的API文档和类型定义
- **[🚀 快速开始指南](./docs/QUICKSTART.md)** - 5分钟上手教程
- **[💼 企业级使用指南](./docs/ENTERPRISE.md)** - 生产环境最佳实践
- **[🔧 配置参考](./docs/CONFIG.md)** - 详细配置选项说明
- **[🎯 环境兼容性](./docs/COMPATIBILITY.md)** - 各环境兼容性测试报告

### 🛠️ 开发文档  
- **[🏗️ 架构设计](./docs/ARCHITECTURE.md)** - 技术架构和设计思路
- **[🧪 测试指南](./docs/TESTING.md)** - 测试用例和验证方法
- **[🐛 故障排除](./docs/TROUBLESHOOTING.md)** - 常见问题解决方案
- **[📈 性能优化](./docs/PERFORMANCE.md)** - 性能优化建议

### 📝 示例代码
- **[基础示例](./examples/basic/)** - 基本功能演示
- **[高级示例](./examples/advanced/)** - 高级功能和技巧
- **[框架集成](./examples/frameworks/)** - Vue/React/Angular集成

## 🤝 社区与支持

### 💬 技术交流
- **GitHub Discussions** - [技术讨论和问答](https://github.com/zhangnuli/wechat-h5-audio-player/discussions)
- **Issue Tracker** - [Bug报告和功能请求](https://github.com/zhangnuli/wechat-h5-audio-player/issues)

### 🆘 获取帮助
1. **查看文档** - 优先阅读相关文档章节
2. **搜索Issues** - 查看是否有类似问题已解决
3. **提交Issue** - 提供详细的环境信息和复现步骤
4. **社区讨论** - 在Discussions中寻求帮助

### 🎯 贡献指南
欢迎各种形式的贡献：
- **🐛 Bug修复** - 发现并修复问题
- **✨ 功能开发** - 添加新功能和改进
- **📝 文档完善** - 改进文档和示例
- **🧪 测试用例** - 补充测试覆盖率
- **🌍 国际化** - 多语言支持

## 📄 许可证

本项目基于 **MIT License** 开源协议发布。

```
MIT License - 自由使用、修改、分发
✅ 商业使用  ✅ 修改源码  ✅ 分发  ✅ 私用
❗ 需保留版权声明  ❗ 需包含许可证
```

详细内容请查看 [LICENSE](./LICENSE) 文件。


<div align="center">

**⭐ 如果这个项目对你有帮助，请给个Star支持一下！**

![GitHub stars](https://img.shields.io/github/stars/zhangnuli/wechat-h5-audio-player?style=social)
![GitHub forks](https://img.shields.io/github/forks/zhangnuli/wechat-h5-audio-player?style=social)

</div>