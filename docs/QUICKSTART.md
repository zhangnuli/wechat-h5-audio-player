# 🚀 快速开始指南

## 5分钟快速上手

### 第一步：安装

```bash
npm install wechat-h5-audio-player
```

### 第二步：创建播放器

```typescript
import { WechatAudioPlayer } from 'wechat-h5-audio-player'

const player = new WechatAudioPlayer({
  src: 'https://example.com/audio.mp3',
  autoplay: true
})
```

### 第三步：在微信中测试

部署到HTTPS服务器，在微信中打开即可听到自动播放！

## 详细教程

### 📦 安装方式

#### NPM/Yarn/PNPM
```bash
# NPM
npm install wechat-h5-audio-player

# Yarn
yarn add wechat-h5-audio-player

# PNPM  
pnpm add wechat-h5-audio-player
```

#### CDN引入
```html
<!-- UMD版本 -->
<script src="https://unpkg.com/wechat-h5-audio-player@latest/dist/wechat-audio-player.umd.js"></script>

<!-- ES模块版本 -->
<script type="module">
  import { WechatAudioPlayer } from 'https://unpkg.com/wechat-h5-audio-player@latest/dist/wechat-audio-player.esm.js'
</script>
```

### 🎵 基础使用

#### 最简配置
```typescript
import { WechatAudioPlayer } from 'wechat-h5-audio-player'

// 仅需音频URL即可
const player = new WechatAudioPlayer({
  src: 'https://example.com/music.mp3'
})

// 手动播放
await player.play()
```

#### 自动播放配置
```typescript
const player = new WechatAudioPlayer({
  src: 'https://example.com/music.mp3',
  autoplay: true,  // 🎯 关键：微信环境下自动播放
  loop: true,      // 循环播放
  volume: 0.8      // 音量80%
})
```

#### 完整配置示例
```typescript
const player = new WechatAudioPlayer({
  // 基础配置
  src: 'https://example.com/background-music.mp3',
  autoplay: true,
  loop: true,
  volume: 0.6,
  muted: false,
  debug: true,

  // 事件回调
  onReady: () => {
    console.log('🎵 播放器准备就绪')
    document.getElementById('loading').style.display = 'none'
  },
  
  onPlay: () => {
    console.log('▶️ 开始播放')
    document.getElementById('playBtn').innerText = '⏸️ 暂停'
  },
  
  onPause: () => {
    console.log('⏸️ 暂停播放')
    document.getElementById('playBtn').innerText = '▶️ 播放'
  },
  
  onError: (error) => {
    console.error('❌ 播放失败:', error.message)
    alert('音频播放失败: ' + error.message)
  }
})
```

### 🎮 播放控制

#### 基本控制
```typescript
// 播放
await player.play()

// 暂停
player.pause()

// 停止
player.stop()

// 切换播放/暂停
const status = player.getStatus()
if (status.isPlaying) {
  player.pause()
} else {
  await player.play()
}
```

#### 音量控制
```typescript
// 设置音量
player.setVolume(0.5)  // 50%音量

// 静音/取消静音
player.setMuted(true)   // 静音
player.setMuted(false)  // 取消静音

// 获取当前音量
const volume = player.getVolume()
console.log('当前音量:', Math.round(volume * 100) + '%')
```

#### 播放模式
```typescript
// 开启循环播放
player.setLoop(true)

// 关闭循环播放  
player.setLoop(false)

// 检查循环状态
const isLooping = player.isLoop()
console.log('是否循环播放:', isLooping)
```

### 📊 状态监控

#### 获取播放状态
```typescript
const status = player.getStatus()

console.log('播放器状态:', {
  state: status.state,              // 播放状态
  isPlaying: status.isPlaying,      // 是否播放中
  currentTime: status.currentTime,  // 当前时间（秒）
  duration: status.duration,        // 总时长（秒）
  volume: status.volume,            // 音量
  muted: status.muted,              // 是否静音
  loop: status.loop,                // 是否循环
  loadProgress: status.loadProgress // 加载进度
})
```

#### 环境信息
```typescript
const env = status.environment

console.log('运行环境:', {
  isWeixin: env.isWeixin,          // 是否微信
  isIOS: env.isIOS,                // 是否iOS
  isAndroid: env.isAndroid,        // 是否Android
  supportsAutoplay: env.supportsAutoplay, // 支持自动播放
  browserType: env.browserType     // 浏览器类型
})
```

### 🎧 事件监听

#### 基本事件
```typescript
// 播放器准备就绪
player.on('ready', () => {
  console.log('可以开始播放了')
})

// 播放开始
player.on('play', () => {
  console.log('音乐开始播放')
  startMusicAnimation()
})

// 播放暂停
player.on('pause', () => {
  console.log('音乐暂停')
  stopMusicAnimation()
})

// 播放结束
player.on('ended', () => {
  console.log('音乐播放完成')
  showReplayButton()
})
```

#### 进度事件
```typescript
// 播放进度更新
player.on('timeupdate', (currentTime) => {
  const duration = player.getDuration()
  const progress = (currentTime / duration) * 100
  
  // 更新进度条
  document.getElementById('progressBar').style.width = progress + '%'
  
  // 更新时间显示
  document.getElementById('currentTime').innerText = formatTime(currentTime)
  document.getElementById('duration').innerText = formatTime(duration)
})

// 音量变化
player.on('volumechange', (volume) => {
  document.getElementById('volumeSlider').value = volume
  document.getElementById('volumeDisplay').innerText = Math.round(volume * 100) + '%'
})
```

#### 错误处理
```typescript
player.on('error', (error) => {
  console.error('播放错误:', error)
  
  // 根据错误类型处理
  if (error.message.includes('network')) {
    showRetryButton()
  } else if (error.message.includes('autoplay')) {
    showPlayButton()
  } else {
    showErrorMessage('播放失败: ' + error.message)
  }
})
```

### 🌐 环境适配

#### 微信环境优化
```typescript
const player = new WechatAudioPlayer({
  src: 'background-music.mp3',
  autoplay: true,  // 微信环境关键配置
  
  onReady: () => {
    const status = player.getStatus()
    
    if (status.environment.isWeixin) {
      console.log('✅ 微信环境，支持自动播放')
      hidePlayButton()
    } else {
      console.log('⚠️ 非微信环境，需要用户交互')
      showPlayButton()
    }
  }
})
```

#### 降级处理
```typescript
const player = new WechatAudioPlayer({
  src: 'audio.mp3',
  autoplay: true,
  
  onPlay: () => {
    // 自动播放成功
    console.log('🎵 自动播放成功')
    document.getElementById('playBtn').style.display = 'none'
  },
  
  onError: (error) => {
    // 自动播放失败，显示播放按钮
    console.log('⚠️ 自动播放失败，需要用户点击')
    const playBtn = document.getElementById('playBtn')
    playBtn.style.display = 'block'
    playBtn.onclick = () => player.play()
  }
})
```

### 🔧 实用工具函数

#### 时间格式化
```typescript
function formatTime(seconds) {
  if (isNaN(seconds) || seconds === Infinity) return '0:00'
  
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// 使用示例
player.on('timeupdate', (currentTime) => {
  const duration = player.getDuration()
  const timeDisplay = `${formatTime(currentTime)} / ${formatTime(duration)}`
  document.getElementById('timeDisplay').innerText = timeDisplay
})
```

#### 进度条交互
```typescript
// HTML
// <div id="progressBar" onclick="seekToPosition(event)">
//   <div id="progressFill"></div>
// </div>

function seekToPosition(event) {
  const progressBar = event.currentTarget
  const rect = progressBar.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const totalWidth = rect.width
  const percentage = clickX / totalWidth
  
  const duration = player.getDuration()
  const targetTime = duration * percentage
  
  // 注意：当前版本暂不支持seek功能
  console.log('点击位置:', percentage * 100 + '%')
}
```

#### 音量滑块
```typescript
// HTML
// <input type="range" id="volumeSlider" min="0" max="1" step="0.01" value="0.8">

document.getElementById('volumeSlider').addEventListener('input', (event) => {
  const volume = parseFloat(event.target.value)
  player.setVolume(volume)
  
  // 更新显示
  document.getElementById('volumeDisplay').innerText = Math.round(volume * 100) + '%'
})
```

### 📱 HTML示例

#### 完整的播放器HTML
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WeChat Audio Player Demo</title>
    <style>
        .player {
            width: 300px;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            margin: 20px auto;
        }
        .controls {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 10px 0;
        }
        .progress-bar {
            width: 100%;
            height: 4px;
            background: #eee;
            border-radius: 2px;
            cursor: pointer;
        }
        .progress-fill {
            height: 100%;
            background: #007bff;
            border-radius: 2px;
            transition: width 0.1s ease;
        }
        .volume-control {
            display: flex;
            align-items: center;
            gap: 10px;
        }
    </style>
</head>
<body>
    <div class="player">
        <h3>🎵 WeChat Audio Player</h3>
        
        <!-- 播放控制 -->
        <div class="controls">
            <button id="playBtn">▶️ 播放</button>
            <button id="pauseBtn">⏸️ 暂停</button>
            <button id="stopBtn">⏹️ 停止</button>
        </div>
        
        <!-- 进度条 -->
        <div class="progress-bar" id="progressBar">
            <div class="progress-fill" id="progressFill"></div>
        </div>
        <div id="timeDisplay">0:00 / 0:00</div>
        
        <!-- 音量控制 -->
        <div class="volume-control">
            <span>🔊</span>
            <input type="range" id="volumeSlider" min="0" max="1" step="0.01" value="0.8">
            <span id="volumeDisplay">80%</span>
        </div>
        
        <!-- 状态显示 -->
        <div id="statusDisplay">状态: 未初始化</div>
    </div>

    <script src="https://unpkg.com/wechat-h5-audio-player@latest/dist/wechat-audio-player.umd.js"></script>
    <script>
        // 创建播放器
        const player = new WechatAudioPlayer.WechatAudioPlayer({
            src: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            autoplay: false,
            debug: true,
            
            onReady: () => {
                document.getElementById('statusDisplay').innerText = '状态: 准备就绪'
            },
            
            onPlay: () => {
                document.getElementById('statusDisplay').innerText = '状态: 播放中'
            },
            
            onPause: () => {
                document.getElementById('statusDisplay').innerText = '状态: 已暂停'
            },
            
            onError: (error) => {
                document.getElementById('statusDisplay').innerText = '状态: 错误 - ' + error.message
            }
        })
        
        // 绑定控制按钮
        document.getElementById('playBtn').onclick = () => player.play()
        document.getElementById('pauseBtn').onclick = () => player.pause()
        document.getElementById('stopBtn').onclick = () => player.stop()
        
        // 音量控制
        document.getElementById('volumeSlider').oninput = (e) => {
            const volume = parseFloat(e.target.value)
            player.setVolume(volume)
            document.getElementById('volumeDisplay').innerText = Math.round(volume * 100) + '%'
        }
        
        // 进度更新
        player.on('timeupdate', (currentTime) => {
            const duration = player.getDuration()
            if (duration > 0) {
                const progress = (currentTime / duration) * 100
                document.getElementById('progressFill').style.width = progress + '%'
                
                const formatTime = (seconds) => {
                    const mins = Math.floor(seconds / 60)
                    const secs = Math.floor(seconds % 60)
                    return `${mins}:${secs.toString().padStart(2, '0')}`
                }
                
                document.getElementById('timeDisplay').innerText = 
                    `${formatTime(currentTime)} / ${formatTime(duration)}`
            }
        })
    </script>
</body>
</html>
```

### 🚀 部署到生产环境

#### 1. HTTPS要求
```bash
# 确保你的服务器支持HTTPS
# 微信环境要求HTTPS才能正常工作
```

#### 2. 音频文件优化
```typescript
// 建议使用CDN托管音频文件
const player = new WechatAudioPlayer({
  src: 'https://cdn.yourdomain.com/audio/background-music.mp3',
  
  // 生产环境配置
  debug: false,           // 关闭调试模式
  volume: 0.6,           // 适中音量
  autoplay: true,        // 微信环境自动播放
  
  loadOptions: {
    timeout: 15000,      // 增加超时时间
    formats: ['mp3', 'ogg'] // 指定支持格式
  }
})
```

#### 3. 错误监控
```typescript
player.on('error', (error) => {
  // 发送错误日志到监控系统
  sendErrorLog({
    error: error.message,
    userAgent: navigator.userAgent,
    url: window.location.href,
    timestamp: new Date().toISOString()
  })
})
```

### 🎯 常见问题

#### Q: 为什么非微信环境不能自动播放？
A: 现代浏览器都有自动播放策略限制，只有微信环境通过WeixinJSBridgeReady可以绕过。

#### Q: 音频加载很慢怎么办？
A: 建议使用CDN，优化音频文件大小，或者增加加载超时时间。

#### Q: 如何实现多个音频切换？
A: 每个音频创建一个独立的播放器实例，或者动态改变src属性。

#### Q: 支持哪些音频格式？
A: 主要支持MP3、OGG、WAV、M4A等常见格式，具体取决于浏览器支持。

### 📖 下一步

- 查看 [API参考手册](./API.md) 了解详细API
- 阅读 [企业级使用指南](./ENTERPRISE.md) 了解生产最佳实践  
- 参考 [示例代码](../examples/) 学习高级用法
- 查看 [故障排除](./TROUBLESHOOTING.md) 解决常见问题