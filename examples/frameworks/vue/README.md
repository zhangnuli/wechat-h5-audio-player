# Vue.js 集成示例

这个示例展示了如何在Vue.js 3项目中集成和使用WeChat H5 Audio Player。

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:3000` 查看示例。

### 构建生产版本

```bash
npm run build
```

## 📁 项目结构

```
vue/
├── src/
│   ├── components/
│   │   ├── BasicPlayer.vue      # 基础播放器组件
│   │   ├── PlaylistPlayer.vue   # 播放列表组件
│   │   └── SoundEffects.vue     # 音效面板组件
│   ├── App.vue                  # 主应用组件
│   └── main.js                  # 入口文件
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎵 组件说明

### BasicPlayer.vue

基础音频播放器组件，演示：
- 播放/暂停控制
- 音量调节
- 静音功能
- 状态显示
- 响应式UI更新

### PlaylistPlayer.vue

播放列表组件，演示：
- 多音频管理
- 曲目切换
- 自动播放下一首
- 播放进度显示

### SoundEffects.vue

音效面板组件，演示：
- 多音效同时播放
- 主音量控制
- 播放日志
- 动态效果

## 💡 核心特性

### 1. 响应式数据绑定

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { WechatAudioPlayer } from 'wechat-h5-audio-player'

const player = ref(null)
const isPlaying = ref(false)
const volume = ref(0.8)

const togglePlay = async () => {
  if (isPlaying.value) {
    player.value.pause()
  } else {
    await player.value.play()
  }
}
</script>
```

### 2. 生命周期管理

```vue
<script setup>
onMounted(() => {
  player.value = new WechatAudioPlayer({
    src: 'audio.mp3',
    onPlay: () => {
      isPlaying.value = true
    },
    onPause: () => {
      isPlaying.value = false
    }
  })
})

onUnmounted(() => {
  if (player.value) {
    player.value.destroy()
  }
})
</script>
```

### 3. 事件处理

```vue
<template>
  <button @click="togglePlay" :disabled="!isReady">
    {{ isPlaying ? '⏸️ 暂停' : '▶️ 播放' }}
  </button>
  
  <input 
    type="range" 
    v-model="volume"
    @input="updateVolume"
    min="0" 
    max="1" 
    step="0.01"
  >
</template>
```

## 🔧 自定义配置

### 环境检测

```vue
<script setup>
const environmentInfo = ref('')

onMounted(() => {
  const player = new WechatAudioPlayer({
    src: 'audio.mp3',
    onReady: () => {
      const status = player.getStatus()
      const env = status.environment
      environmentInfo.value = `${env.isWeixin ? '微信' : '浏览器'} / ${env.isIOS ? 'iOS' : 'Android'}`
    }
  })
})
</script>
```

### 错误处理

```vue
<script setup>
const errorMessage = ref('')
const showError = ref(false)

const createPlayer = () => {
  try {
    player.value = new WechatAudioPlayer({
      src: 'audio.mp3',
      onError: (error) => {
        errorMessage.value = error.message
        showError.value = true
      }
    })
  } catch (error) {
    errorMessage.value = `初始化失败: ${error.message}`
    showError.value = true
  }
}
</script>
```

## 📱 最佳实践

### 1. 组件封装

创建可复用的音频播放器组件：

```vue
<!-- AudioPlayer.vue -->
<template>
  <div class="audio-player">
    <button @click="togglePlay">
      {{ isPlaying ? '⏸️' : '▶️' }}
    </button>
    <span>{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
  </div>
</template>

<script setup>
import { useAudioPlayer } from '@/composables/useAudioPlayer'

const props = defineProps({
  src: String,
  autoplay: Boolean
})

const { 
  isPlaying, 
  currentTime, 
  duration, 
  togglePlay,
  formatTime 
} = useAudioPlayer(props.src, {
  autoplay: props.autoplay
})
</script>
```

### 2. Composables 模式

创建可复用的逻辑：

```javascript
// composables/useAudioPlayer.js
import { ref, onMounted, onUnmounted } from 'vue'
import { WechatAudioPlayer } from 'wechat-h5-audio-player'

export function useAudioPlayer(src, options = {}) {
  const player = ref(null)
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  
  const togglePlay = async () => {
    if (isPlaying.value) {
      player.value.pause()
    } else {
      await player.value.play()
    }
  }
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  onMounted(() => {
    player.value = new WechatAudioPlayer({
      src,
      ...options,
      onPlay: () => isPlaying.value = true,
      onPause: () => isPlaying.value = false,
      onTimeUpdate: (time) => currentTime.value = time
    })
  })
  
  onUnmounted(() => {
    if (player.value) {
      player.value.destroy()
    }
  })
  
  return {
    player,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    formatTime
  }
}
```

## 🐛 常见问题

### 问题1：播放器状态不同步

确保在播放器事件回调中更新Vue的响应式数据：

```vue
<script setup>
const player = new WechatAudioPlayer({
  src: 'audio.mp3',
  onPlay: () => {
    isPlaying.value = true  // ✅ 正确
  }
})

// ❌ 错误：直接查询状态可能不及时
// const checkStatus = () => {
//   isPlaying.value = player.getStatus().isPlaying
// }
</script>
```

### 问题2：内存泄漏

确保在组件卸载时销毁播放器：

```vue
<script setup>
onUnmounted(() => {
  if (player.value) {
    player.value.destroy()  // ✅ 必须调用
  }
})
</script>
```

### 问题3：多个播放器冲突

使用播放器管理器避免冲突：

```vue
<script setup>
import { usePlayerManager } from '@/composables/usePlayerManager'

const { createPlayer, destroyPlayer } = usePlayerManager()

const playAudio = (src) => {
  destroyPlayer('current')  // 先销毁当前播放器
  createPlayer('current', { src })
}
</script>
```

## 📖 更多示例

- 查看 [基础示例](../../basic/) 了解基本用法
- 查看 [高级示例](../../advanced/) 了解高级功能
- 查看 [React示例](../react/) 了解React集成