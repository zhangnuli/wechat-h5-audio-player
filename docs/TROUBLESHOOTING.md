# 🐛 故障排除指南

## 常见问题速查

| 问题分类 | 快速跳转 |
|----------|----------|
| 🚫 自动播放失败 | [自动播放问题](#自动播放问题) |
| 📁 加载问题 | [音频加载问题](#音频加载问题) |
| 🔊 音量问题 | [音量控制问题](#音量控制问题) |
| 📱 环境兼容 | [环境兼容问题](#环境兼容问题) |
| ⚙️ 配置错误 | [配置问题](#配置问题) |
| 🔧 集成问题 | [集成问题](#集成问题) |

## 自动播放问题

### ❌ 问题：微信环境下自动播放失败

#### 症状
```
❌ Error: Autoplay failed
❌ 播放器状态停留在 'ready'，没有进入 'playing'
```

#### 排查步骤

1. **检查HTTPS环境**
```typescript
// 检查协议
console.log('当前协议:', location.protocol)
// 必须是 'https:' 才能在微信中正常工作
```

2. **检查微信环境检测**
```typescript
const status = player.getStatus()
console.log('环境检测:', {
  isWeixin: status.environment.isWeixin,
  supportsAutoplay: status.environment.supportsAutoplay
})
```

3. **检查初始化时机**
```typescript
// ✅ 正确方式 - 在DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  const player = new WechatAudioPlayer({
    src: 'audio.mp3',
    autoplay: true,
    debug: true  // 开启调试查看详细日志
  })
})

// ❌ 错误方式 - 过早初始化
const player = new WechatAudioPlayer({...}) // DOM未加载完成
```

#### 解决方案

**方案1: 确保正确配置**
```typescript
const player = new WechatAudioPlayer({
  src: 'https://your-domain.com/audio.mp3', // 使用HTTPS URL
  autoplay: true,
  debug: true,
  
  onPlay: () => {
    console.log('✅ 自动播放成功')
  },
  
  onError: (error) => {
    console.error('❌ 自动播放失败:', error.message)
  }
})
```

**方案2: 降级处理**
```typescript
const player = new WechatAudioPlayer({
  src: 'audio.mp3',
  autoplay: true,
  
  onError: (error) => {
    if (error.message.includes('autoplay')) {
      // 显示播放按钮，等待用户交互
      showPlayButton()
    }
  }
})

function showPlayButton() {
  const btn = document.createElement('button')
  btn.innerText = '🎵 点击播放音乐'
  btn.onclick = () => {
    player.play()
    btn.style.display = 'none'
  }
  document.body.appendChild(btn)
}
```

### ❌ 问题：非微信环境自动播放被阻止

#### 症状
```
❌ NotAllowedError: play() failed because the user didn't interact with the document first
```

#### 解决方案
```typescript
const player = new WechatAudioPlayer({
  src: 'audio.mp3',
  autoplay: true,
  
  onReady: () => {
    const env = player.getStatus().environment
    
    if (!env.isWeixin) {
      // 非微信环境，显示播放提示
      showInteractionRequired()
    }
  }
})

function showInteractionRequired() {
  const overlay = document.createElement('div')
  overlay.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                background: rgba(0,0,0,0.8); display: flex; align-items: center; 
                justify-content: center; z-index: 9999;">
      <div style="background: white; padding: 30px; border-radius: 10px; text-align: center;">
        <h3>🎵 需要您的允许</h3>
        <p>浏览器需要用户交互才能播放音频</p>
        <button onclick="startAudio()" style="padding: 10px 20px; font-size: 16px;">
          🔊 开始播放
        </button>
      </div>
    </div>
  `
  document.body.appendChild(overlay)
  
  window.startAudio = () => {
    player.play()
    document.body.removeChild(overlay)
  }
}
```

## 音频加载问题

### ❌ 问题：音频文件加载失败

#### 症状
```
❌ Error: Failed to load audio
❌ 播放器状态停留在 'loading'
```

#### 排查步骤

1. **检查音频URL**
```typescript
// 测试音频URL是否可访问
fetch('https://example.com/audio.mp3')
  .then(response => {
    if (response.ok) {
      console.log('✅ 音频URL可访问')
    } else {
      console.error('❌ 音频URL访问失败:', response.status)
    }
  })
  .catch(error => {
    console.error('❌ 网络错误:', error)
  })
```

2. **检查CORS设置**
```typescript
// 检查服务器是否设置了正确的CORS头
// 需要服务器返回：
// Access-Control-Allow-Origin: *
// 或具体的域名
```

3. **检查音频格式**
```typescript
const player = new WechatAudioPlayer({
  src: 'audio.mp3',
  debug: true,
  
  loadOptions: {
    formats: ['mp3', 'ogg', 'wav'], // 指定支持的格式
    timeout: 15000 // 增加超时时间
  }
})
```

#### 解决方案

**方案1: 使用CDN**
```typescript
// 使用可靠的CDN服务
const player = new WechatAudioPlayer({
  src: 'https://cdn.jsdelivr.net/gh/your-repo/audio.mp3',
  // 或使用其他CDN
  // src: 'https://unpkg.com/your-package/audio.mp3'
})
```

**方案2: 添加备用音频源**
```typescript
let player = null
const audioSources = [
  'https://cdn1.example.com/audio.mp3',
  'https://cdn2.example.com/audio.mp3',
  'https://backup.example.com/audio.mp3'
]

async function loadAudioWithFallback() {
  for (let src of audioSources) {
    try {
      player = new WechatAudioPlayer({
        src: src,
        autoplay: true,
        
        onError: (error) => {
          console.error(`❌ 加载失败: ${src}`, error)
        }
      })
      
      // 等待加载完成
      await new Promise((resolve, reject) => {
        player.on('ready', resolve)
        player.on('error', reject)
      })
      
      console.log(`✅ 加载成功: ${src}`)
      break
      
    } catch (error) {
      console.error(`❌ 尝试 ${src} 失败:`, error)
      if (player) player.destroy()
    }
  }
}
```

**方案3: 增加重试机制**
```typescript
function createPlayerWithRetry(src, maxRetries = 3) {
  let retryCount = 0
  
  function attemptLoad() {
    const player = new WechatAudioPlayer({
      src: src,
      autoplay: true,
      
      onError: (error) => {
        retryCount++
        if (retryCount < maxRetries) {
          console.log(`❌ 加载失败，重试第 ${retryCount} 次...`)
          setTimeout(() => {
            player.destroy()
            attemptLoad()
          }, 2000)
        } else {
          console.error(`❌ 重试 ${maxRetries} 次后仍然失败`)
        }
      },
      
      onReady: () => {
        console.log('✅ 音频加载成功')
      }
    })
    
    return player
  }
  
  return attemptLoad()
}
```

### ❌ 问题：加载超时

#### 解决方案
```typescript
const player = new WechatAudioPlayer({
  src: 'large-audio-file.mp3',
  
  loadOptions: {
    timeout: 30000, // 增加超时时间到30秒
    preload: true   // 确保预加载
  },
  
  onError: (error) => {
    if (error.message.includes('timeout')) {
      // 显示网络慢的提示
      showSlowNetworkWarning()
    }
  }
})

function showSlowNetworkWarning() {
  alert('网络较慢，正在努力加载中，请稍候...')
}
```

## 音量控制问题

### ❌ 问题：音量设置无效

#### 症状
```typescript
player.setVolume(0.5)
console.log(player.getVolume()) // 输出仍然是之前的值
```

#### 排查步骤

1. **检查静音状态**
```typescript
// 检查是否被静音
if (player.isMuted()) {
  console.log('播放器处于静音状态')
  player.setMuted(false) // 取消静音
}
```

2. **检查音频状态**
```typescript
const status = player.getStatus()
if (status.state !== 'playing' && status.state !== 'ready') {
  console.log('音频未准备好，无法设置音量')
}
```

#### 解决方案
```typescript
const player = new WechatAudioPlayer({
  src: 'audio.mp3',
  volume: 0.8, // 在初始化时设置音量
  
  onReady: () => {
    // 在ready事件中设置音量更可靠
    player.setVolume(0.5)
    console.log('音量设置为:', player.getVolume())
  }
})
```

### ❌ 问题：iOS设备音量控制异常

#### 解决方案
```typescript
const player = new WechatAudioPlayer({
  src: 'audio.mp3',
  
  onReady: () => {
    const env = player.getStatus().environment
    
    if (env.isIOS) {
      // iOS设备特殊处理
      setTimeout(() => {
        player.setVolume(0.8)
      }, 100)
    }
  }
})
```

## 环境兼容问题

### ❌ 问题：在某些Android设备上无法播放

#### 排查步骤
```typescript
const player = new WechatAudioPlayer({
  src: 'audio.mp3',
  debug: true,
  
  onReady: () => {
    const env = player.getStatus().environment
    console.log('设备信息:', {
      userAgent: env.userAgent,
      isAndroid: env.isAndroid,
      browserType: env.browserType
    })
  }
})
```

#### 解决方案
```typescript
const player = new WechatAudioPlayer({
  src: 'audio.mp3',
  
  loadOptions: {
    formats: ['mp3', 'ogg'], // Android对OGG支持更好
    timeout: 20000           // Android设备可能需要更长加载时间
  },
  
  onError: (error) => {
    const env = player.getStatus().environment
    
    if (env.isAndroid && error.message.includes('format')) {
      // 尝试使用OGG格式
      const oggPlayer = new WechatAudioPlayer({
        src: 'audio.ogg',
        autoplay: true
      })
    }
  }
})
```

### ❌ 问题：旧版微信兼容性

#### 解决方案
```typescript
const player = new WechatAudioPlayer({
  src: 'audio.mp3',
  
  onReady: () => {
    const env = player.getStatus().environment
    
    if (env.isWeixin && env.weixinVersion) {
      const version = parseFloat(env.weixinVersion)
      
      if (version < 7.0) {
        console.warn('微信版本较旧，可能存在兼容性问题')
        // 可以显示升级提示
        showUpdateWechatTip()
      }
    }
  }
})
```

## 配置问题

### ❌ 问题：TypeScript类型错误

#### 症状
```typescript
// ❌ 类型错误
const player = new WechatAudioPlayer('audio.mp3') // 应该传入配置对象

// ❌ 属性不存在
player.seek(30) // seek方法不存在
```

#### 解决方案
```typescript
// ✅ 正确的TypeScript使用
import { WechatAudioPlayer, WechatAudioConfig } from 'wechat-h5-audio-player'

const config: WechatAudioConfig = {
  src: 'audio.mp3',
  autoplay: true,
  volume: 0.8
}

const player = new WechatAudioPlayer(config)

// ✅ 使用存在的方法
player.setVolume(0.5)
const status = player.getStatus()
```

### ❌ 问题：事件回调中的this指向

#### 症状
```typescript
class MusicPlayer {
  constructor() {
    this.player = new WechatAudioPlayer({
      src: 'audio.mp3',
      onPlay: this.handlePlay // ❌ this指向错误
    })
  }
  
  handlePlay() {
    console.log(this) // undefined 或 window
  }
}
```

#### 解决方案
```typescript
class MusicPlayer {
  constructor() {
    this.player = new WechatAudioPlayer({
      src: 'audio.mp3',
      onPlay: () => this.handlePlay() // ✅ 箭头函数
      // 或者
      // onPlay: this.handlePlay.bind(this) // ✅ 绑定this
    })
  }
  
  handlePlay() {
    console.log(this) // 正确的MusicPlayer实例
  }
}
```

## 集成问题

### ❌ 问题：Vue/React项目中使用问题

#### Vue 3 解决方案
```vue
<template>
  <div>
    <button @click="togglePlay">{{ isPlaying ? '暂停' : '播放' }}</button>
    <div>音量: {{ volume * 100 }}%</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { WechatAudioPlayer } from 'wechat-h5-audio-player'

const player = ref(null)
const isPlaying = ref(false)
const volume = ref(0.8)

onMounted(() => {
  player.value = new WechatAudioPlayer({
    src: 'audio.mp3',
    autoplay: false,
    
    onPlay: () => {
      isPlaying.value = true
    },
    
    onPause: () => {
      isPlaying.value = false
    },
    
    onVolumeChange: (vol) => {
      volume.value = vol
    }
  })
})

onUnmounted(() => {
  if (player.value) {
    player.value.destroy()
  }
})

const togglePlay = async () => {
  if (isPlaying.value) {
    player.value.pause()
  } else {
    await player.value.play()
  }
}
</script>
```

#### React 解决方案
```jsx
import React, { useState, useEffect, useRef } from 'react'
import { WechatAudioPlayer } from 'wechat-h5-audio-player'

function AudioPlayerComponent() {
  const playerRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.8)
  
  useEffect(() => {
    playerRef.current = new WechatAudioPlayer({
      src: 'audio.mp3',
      autoplay: false,
      
      onPlay: () => setIsPlaying(true),
      onPause: () => setIsPlaying(false),
      onVolumeChange: (vol) => setVolume(vol)
    })
    
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
      }
    }
  }, [])
  
  const togglePlay = async () => {
    if (isPlaying) {
      playerRef.current.pause()
    } else {
      await playerRef.current.play()
    }
  }
  
  return (
    <div>
      <button onClick={togglePlay}>
        {isPlaying ? '暂停' : '播放'}
      </button>
      <div>音量: {Math.round(volume * 100)}%</div>
    </div>
  )
}
```

### ❌ 问题：打包后路径问题

#### Webpack解决方案
```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(mp3|wav|ogg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'audio/[name][ext]'
        }
      }
    ]
  }
}

// 在代码中使用
import audioFile from './assets/audio.mp3'

const player = new WechatAudioPlayer({
  src: audioFile // Webpack会处理为正确的路径
})
```

#### Vite解决方案
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      external: ['wechat-h5-audio-player']
    }
  }
}

// 在代码中使用
import audioUrl from './assets/audio.mp3?url'

const player = new WechatAudioPlayer({
  src: audioUrl
})
```

## 性能问题

### ❌ 问题：内存泄漏

#### 症状
- 页面长时间运行后变慢
- 浏览器内存占用持续增长

#### 解决方案
```typescript
class AudioManager {
  constructor() {
    this.players = new Map()
  }
  
  createPlayer(id, config) {
    // 如果已存在，先销毁
    if (this.players.has(id)) {
      this.players.get(id).destroy()
    }
    
    const player = new WechatAudioPlayer(config)
    this.players.set(id, player)
    return player
  }
  
  destroyPlayer(id) {
    if (this.players.has(id)) {
      this.players.get(id).destroy()
      this.players.delete(id)
    }
  }
  
  destroyAll() {
    this.players.forEach(player => player.destroy())
    this.players.clear()
  }
}

// 在页面卸载时清理
window.addEventListener('beforeunload', () => {
  audioManager.destroyAll()
})
```

### ❌ 问题：多个播放器冲突

#### 解决方案
```typescript
class SingletonAudioPlayer {
  constructor() {
    if (SingletonAudioPlayer.instance) {
      SingletonAudioPlayer.instance.destroy()
    }
    
    this.player = new WechatAudioPlayer({
      src: 'audio.mp3',
      autoplay: true
    })
    
    SingletonAudioPlayer.instance = this
  }
  
  static getInstance(config) {
    if (!SingletonAudioPlayer.instance) {
      new SingletonAudioPlayer(config)
    }
    return SingletonAudioPlayer.instance.player
  }
}

// 使用单例模式
const player = SingletonAudioPlayer.getInstance({
  src: 'audio.mp3'
})
```

## 调试技巧

### 开启详细调试
```typescript
const player = new WechatAudioPlayer({
  src: 'audio.mp3',
  debug: true, // 开启调试模式
  
  onReady: () => {
    // 输出详细状态信息
    console.table(player.getStatus())
  }
})
```

### 手动检测工具
```typescript
// 创建检测工具
function diagnoseAudioPlayer(player) {
  const status = player.getStatus()
  const env = status.environment
  
  console.group('🔍 播放器诊断信息')
  
  console.log('📱 环境信息:')
  console.table({
    '是否微信': env.isWeixin,
    '设备类型': env.isIOS ? 'iOS' : env.isAndroid ? 'Android' : 'Desktop',
    '浏览器': env.browserType,
    '支持自动播放': env.supportsAutoplay,
    '协议': env.isHTTPS ? 'HTTPS' : 'HTTP'
  })
  
  console.log('🎵 播放器状态:')
  console.table({
    '状态': status.state,
    '是否播放': status.isPlaying,
    '音量': status.volume,
    '静音': status.muted,
    '循环': status.loop,
    '加载进度': (status.loadProgress * 100).toFixed(1) + '%'
  })
  
  console.log('⏱️ 时间信息:')
  console.table({
    '当前时间': status.currentTime.toFixed(2) + '秒',
    '总时长': status.duration.toFixed(2) + '秒',
    '进度': ((status.currentTime / status.duration) * 100).toFixed(1) + '%'
  })
  
  console.groupEnd()
}

// 使用诊断工具
diagnoseAudioPlayer(player)
```

### 实时监控面板
```html
<div id="debugPanel" style="position: fixed; top: 10px; right: 10px; 
                           background: rgba(0,0,0,0.8); color: white; 
                           padding: 10px; font-family: monospace; 
                           font-size: 12px; border-radius: 5px; z-index: 9999;">
  <div id="debugInfo">调试信息加载中...</div>
</div>

<script>
function startDebugMonitor(player) {
  const panel = document.getElementById('debugInfo')
  
  setInterval(() => {
    const status = player.getStatus()
    const env = status.environment
    
    panel.innerHTML = `
      <div><strong>🎵 播放器状态</strong></div>
      <div>状态: ${status.state}</div>
      <div>播放: ${status.isPlaying ? '✅' : '❌'}</div>
      <div>音量: ${Math.round(status.volume * 100)}%</div>
      <div>时间: ${status.currentTime.toFixed(1)}/${status.duration.toFixed(1)}s</div>
      <br>
      <div><strong>📱 环境信息</strong></div>
      <div>微信: ${env.isWeixin ? '✅' : '❌'}</div>
      <div>设备: ${env.isIOS ? 'iOS' : env.isAndroid ? 'Android' : 'Desktop'}</div>
      <div>自动播放: ${env.supportsAutoplay ? '✅' : '❌'}</div>
    `
  }, 500)
}

// 开启监控
startDebugMonitor(player)
</script>
```

## 获取帮助

如果上述解决方案都无法解决你的问题，可以：

1. **查看控制台错误** - 开启debug模式查看详细日志
2. **检查网络请求** - 使用浏览器开发者工具检查音频加载
3. **提交Issue** - 到[GitHub仓库](https://github.com/zhangnuli/wechat-h5-audio-player/issues)提交问题
4. **社区求助** - 在[Discussions](https://github.com/zhangnuli/wechat-h5-audio-player/discussions)中寻求帮助

提交问题时请包含：
- 设备和浏览器信息
- 详细的错误信息
- 复现步骤
- 相关的代码片段