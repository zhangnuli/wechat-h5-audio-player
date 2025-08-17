<template>
  <div class="card">
    <h3>🎵 基础播放器</h3>
    
    <div class="status" :class="statusType">
      {{ statusMessage }}
    </div>
    
    <div class="controls">
      <button class="btn primary" @click="togglePlay" :disabled="!isReady">
        {{ isPlaying ? '⏸️ 暂停' : '▶️ 播放' }}
      </button>
      <button class="btn" @click="stop" :disabled="!isReady">
        ⏹️ 停止
      </button>
      <button class="btn" @click="toggleMute" :disabled="!isReady">
        {{ isMuted ? '🔇 取消静音' : '🔊 静音' }}
      </button>
    </div>
    
    <div class="volume-control">
      <label>🔊 音量: {{ Math.round(volume * 100) }}%</label>
      <input 
        type="range" 
        class="volume-slider"
        min="0" 
        max="1" 
        step="0.01" 
        v-model="volume"
        @input="updateVolume"
        :disabled="!isReady"
      >
    </div>
    
    <div class="info-panel">
      <div class="info-row">
        <span>状态:</span>
        <span>{{ playerState }}</span>
      </div>
      <div class="info-row">
        <span>环境:</span>
        <span>{{ environmentInfo }}</span>
      </div>
      <div class="info-row">
        <span>当前时间:</span>
        <span>{{ formatTime(currentTime) }}</span>
      </div>
      <div class="info-row">
        <span>总时长:</span>
        <span>{{ formatTime(duration) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { WechatAudioPlayer } from 'wechat-h5-audio-player'

// 响应式数据
const player = ref(null)
const isReady = ref(false)
const isPlaying = ref(false)
const isMuted = ref(false)
const volume = ref(0.8)
const playerState = ref('未初始化')
const environmentInfo = ref('检测中...')
const currentTime = ref(0)
const duration = ref(0)
const statusMessage = ref('正在初始化播放器...')
const statusType = ref('info')

// 计算属性
const formatTime = computed(() => {
  return (seconds) => {
    if (isNaN(seconds) || seconds === Infinity) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
})

// 方法
const updateStatus = () => {
  if (!player.value) return
  
  const status = player.value.getStatus()
  
  isPlaying.value = status.isPlaying
  isMuted.value = status.muted
  volume.value = status.volume
  playerState.value = status.state
  currentTime.value = status.currentTime
  duration.value = status.duration
  
  const env = status.environment
  environmentInfo.value = `${env.isWeixin ? '微信' : '浏览器'} / ${env.isIOS ? 'iOS' : env.isAndroid ? 'Android' : 'Desktop'}`
}

const togglePlay = async () => {
  if (!player.value) return
  
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

const stop = () => {
  if (player.value) {
    player.value.stop()
  }
}

const toggleMute = () => {
  if (player.value) {
    player.value.setMuted(!isMuted.value)
  }
}

const updateVolume = () => {
  if (player.value) {
    player.value.setVolume(volume.value)
  }
}

// 生命周期
onMounted(() => {
  try {
    player.value = new WechatAudioPlayer({
      src: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      autoplay: false,
      volume: volume.value,
      debug: true,
      
      onReady: () => {
        isReady.value = true
        statusMessage.value = '✅ 播放器准备就绪'
        statusType.value = 'success'
        updateStatus()
      },
      
      onPlay: () => {
        statusMessage.value = '🎵 正在播放'
        statusType.value = 'success'
        updateStatus()
      },
      
      onPause: () => {
        statusMessage.value = '⏸️ 播放已暂停'
        statusType.value = 'info'
        updateStatus()
      },
      
      onStop: () => {
        statusMessage.value = '⏹️ 播放已停止'
        statusType.value = 'info'
        updateStatus()
      },
      
      onError: (error) => {
        statusMessage.value = `❌ 错误: ${error.message}`
        statusType.value = 'error'
        updateStatus()
      },
      
      onVolumeChange: () => {
        updateStatus()
      },
      
      onTimeUpdate: () => {
        updateStatus()
      }
    })
    
    // 定期更新状态
    const intervalId = setInterval(updateStatus, 1000)
    
    onUnmounted(() => {
      clearInterval(intervalId)
    })
    
  } catch (error) {
    statusMessage.value = `❌ 初始化失败: ${error.message}`
    statusType.value = 'error'
  }
})

onUnmounted(() => {
  if (player.value) {
    player.value.destroy()
  }
})
</script>