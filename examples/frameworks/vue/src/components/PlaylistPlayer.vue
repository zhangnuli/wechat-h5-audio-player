<template>
  <div class="card">
    <h3>🎼 播放列表</h3>
    
    <div class="playlist">
      <div 
        v-for="(track, index) in playlist" 
        :key="index"
        class="track-item"
        :class="{ active: currentTrack === index }"
        @click="playTrack(index)"
      >
        <div class="track-info">
          <div class="track-title">{{ track.title }}</div>
          <div class="track-artist">{{ track.artist }}</div>
        </div>
        <div class="track-status">
          {{ currentTrack === index && isPlaying ? '🎵' : '▶️' }}
        </div>
      </div>
    </div>
    
    <div class="controls">
      <button class="btn" @click="prevTrack" :disabled="!canGoPrev">
        ⏮️ 上一首
      </button>
      <button class="btn primary" @click="togglePlay" :disabled="!isReady">
        {{ isPlaying ? '⏸️ 暂停' : '▶️ 播放' }}
      </button>
      <button class="btn" @click="nextTrack" :disabled="!canGoNext">
        ⏭️ 下一首
      </button>
    </div>
    
    <div class="status" :class="statusType">
      {{ statusMessage }}
    </div>
    
    <div class="info-panel">
      <div class="info-row">
        <span>当前曲目:</span>
        <span>{{ currentTrack + 1 }} / {{ playlist.length }}</span>
      </div>
      <div class="info-row">
        <span>播放模式:</span>
        <span>{{ playMode }}</span>
      </div>
      <div class="info-row">
        <span>进度:</span>
        <span>{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { WechatAudioPlayer } from 'wechat-h5-audio-player'

// 播放列表数据
const playlist = ref([
  {
    title: '测试音频 1',
    artist: 'SoundJay',
    src: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    title: '测试音频 2', 
    artist: 'SoundJay',
    src: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    title: '测试音频 3',
    artist: 'SoundJay', 
    src: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  }
])

// 响应式数据
const player = ref(null)
const currentTrack = ref(0)
const isReady = ref(false)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const statusMessage = ref('选择一首歌曲开始播放')
const statusType = ref('info')
const playMode = ref('顺序播放')

// 计算属性
const canGoPrev = computed(() => currentTrack.value > 0)
const canGoNext = computed(() => currentTrack.value < playlist.value.length - 1)

const formatTime = computed(() => {
  return (seconds) => {
    if (isNaN(seconds) || seconds === Infinity) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
})

// 方法
const createPlayer = (trackIndex) => {
  if (player.value) {
    player.value.destroy()
  }
  
  const track = playlist.value[trackIndex]
  if (!track) return
  
  try {
    player.value = new WechatAudioPlayer({
      src: track.src,
      autoplay: false,
      debug: false,
      
      onReady: () => {
        isReady.value = true
        statusMessage.value = `✅ ${track.title} 准备就绪`
        statusType.value = 'success'
        updateStatus()
      },
      
      onPlay: () => {
        statusMessage.value = `🎵 正在播放: ${track.title}`
        statusType.value = 'success'
        updateStatus()
      },
      
      onPause: () => {
        statusMessage.value = `⏸️ 已暂停: ${track.title}`
        statusType.value = 'info'
        updateStatus()
      },
      
      onEnded: () => {
        statusMessage.value = `🏁 播放完成: ${track.title}`
        statusType.value = 'info'
        
        // 自动播放下一首
        if (canGoNext.value) {
          nextTrack()
        } else {
          // 播放列表结束
          statusMessage.value = '🎉 播放列表播放完成'
        }
        updateStatus()
      },
      
      onError: (error) => {
        statusMessage.value = `❌ ${track.title} 播放失败: ${error.message}`
        statusType.value = 'error'
        updateStatus()
      },
      
      onTimeUpdate: () => {
        updateStatus()
      }
    })
  } catch (error) {
    statusMessage.value = `❌ 创建播放器失败: ${error.message}`
    statusType.value = 'error'
  }
}

const updateStatus = () => {
  if (!player.value) return
  
  const status = player.value.getStatus()
  isPlaying.value = status.isPlaying
  currentTime.value = status.currentTime
  duration.value = status.duration
}

const playTrack = (index) => {
  if (index === currentTrack.value && player.value) {
    // 点击当前曲目，切换播放/暂停
    togglePlay()
  } else {
    // 切换到新曲目
    currentTrack.value = index
    createPlayer(index)
    setTimeout(() => {
      if (player.value && isReady.value) {
        player.value.play()
      }
    }, 500)
  }
}

const togglePlay = async () => {
  if (!player.value || !isReady.value) return
  
  try {
    if (isPlaying.value) {
      player.value.pause()
    } else {
      await player.value.play()
    }
  } catch (error) {
    statusMessage.value = `播放失败: ${error.message}`
    statusType.value = 'error'
  }
}

const prevTrack = () => {
  if (canGoPrev.value) {
    playTrack(currentTrack.value - 1)
  }
}

const nextTrack = () => {
  if (canGoNext.value) {
    playTrack(currentTrack.value + 1)
  }
}

// 生命周期
onMounted(() => {
  // 初始加载第一首歌
  createPlayer(0)
})

onUnmounted(() => {
  if (player.value) {
    player.value.destroy()
  }
})
</script>

<style scoped>
.playlist {
  margin: 20px 0;
  max-height: 200px;
  overflow-y: auto;
}

.track-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  margin: 5px 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.track-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(5px);
}

.track-item.active {
  background: rgba(76, 175, 80, 0.3);
  border: 1px solid #4CAF50;
}

.track-info {
  flex: 1;
}

.track-title {
  font-weight: bold;
  margin-bottom: 2px;
}

.track-artist {
  font-size: 12px;
  opacity: 0.8;
}

.track-status {
  font-size: 16px;
}
</style>