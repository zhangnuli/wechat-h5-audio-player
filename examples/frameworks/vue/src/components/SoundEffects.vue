<template>
  <div class="card">
    <h3>🔊 音效面板</h3>
    
    <div class="sound-grid">
      <button
        v-for="sound in soundEffects"
        :key="sound.id"
        class="sound-btn"
        :class="{ playing: playingEffects.has(sound.id) }"
        @click="playSound(sound)"
      >
        <div class="sound-icon">{{ sound.icon }}</div>
        <div class="sound-name">{{ sound.name }}</div>
      </button>
    </div>
    
    <div class="controls">
      <button class="btn" @click="stopAllSounds">
        ⏹️ 停止所有音效
      </button>
      <button class="btn" @click="setMasterVolume(0.5)">
        🔊 音量50%
      </button>
      <button class="btn" @click="setMasterVolume(1.0)">
        🔊 音量100%
      </button>
    </div>
    
    <div class="volume-control">
      <label>🔊 主音量: {{ Math.round(masterVolume * 100) }}%</label>
      <input 
        type="range" 
        class="volume-slider"
        min="0" 
        max="1" 
        step="0.01" 
        v-model="masterVolume"
        @input="updateMasterVolume"
      >
    </div>
    
    <div class="info-panel">
      <div class="info-row">
        <span>活跃音效:</span>
        <span>{{ playingEffects.size }}</span>
      </div>
      <div class="info-row">
        <span>播放次数:</span>
        <span>{{ playCount }}</span>
      </div>
      <div class="info-row">
        <span>主音量:</span>
        <span>{{ Math.round(masterVolume * 100) }}%</span>
      </div>
    </div>
    
    <div class="log-panel">
      <div class="log-header">
        <span>📝 播放日志</span>
        <button class="btn" style="padding: 2px 8px; font-size: 10px;" @click="clearLog">
          清除
        </button>
      </div>
      <div class="log-content" ref="logContainer">
        <div v-for="log in logs" :key="log.id" class="log-entry">
          <span class="log-time">[{{ log.time }}]</span>
          {{ log.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onUnmounted, nextTick } from 'vue'
import { WechatAudioPlayer } from 'wechat-h5-audio-player'

// 音效数据
const soundEffects = ref([
  {
    id: 'click',
    name: '点击',
    icon: '👆',
    src: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    id: 'success',
    name: '成功',
    icon: '✅',
    src: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    id: 'error',
    name: '错误',
    icon: '❌',
    src: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    id: 'notification',
    name: '通知',
    icon: '🔔',
    src: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    id: 'coin',
    name: '金币',
    icon: '🪙',
    src: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    id: 'whoosh',
    name: '滑动',
    icon: '💨',
    src: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  }
])

// 响应式数据
const playingEffects = reactive(new Set())
const players = reactive(new Map())
const masterVolume = ref(0.8)
const playCount = ref(0)
const logs = ref([])
const logContainer = ref(null)

let logIdCounter = 0

// 方法
const addLog = (message) => {
  const now = new Date()
  const time = now.toLocaleTimeString()
  
  logs.value.push({
    id: ++logIdCounter,
    time,
    message
  })
  
  // 限制日志条数
  if (logs.value.length > 50) {
    logs.value.shift()
  }
  
  // 滚动到底部
  nextTick(() => {
    if (logContainer.value) {
      logContainer.value.scrollTop = logContainer.value.scrollHeight
    }
  })
}

const playSound = (sound) => {
  const soundId = `${sound.id}_${Date.now()}`
  
  try {
    const player = new WechatAudioPlayer({
      src: sound.src,
      autoplay: true,
      volume: masterVolume.value,
      debug: false,
      
      onPlay: () => {
        playingEffects.add(sound.id)
        playCount.value++
        addLog(`🔊 ${sound.name} 开始播放`)
      },
      
      onEnded: () => {
        playingEffects.delete(sound.id)
        players.delete(soundId)
        addLog(`✅ ${sound.name} 播放完成`)
        
        // 清理播放器
        setTimeout(() => {
          player.destroy()
        }, 100)
      },
      
      onError: (error) => {
        playingEffects.delete(sound.id)
        players.delete(soundId)
        addLog(`❌ ${sound.name} 播放失败: ${error.message}`)
        player.destroy()
      }
    })
    
    players.set(soundId, player)
    addLog(`🎵 创建 ${sound.name} 播放器`)
    
  } catch (error) {
    addLog(`❌ 创建 ${sound.name} 播放器失败: ${error.message}`)
  }
}

const stopAllSounds = () => {
  players.forEach((player, id) => {
    try {
      player.destroy()
    } catch (error) {
      console.warn('销毁播放器失败:', error)
    }
  })
  
  players.clear()
  playingEffects.clear()
  addLog('🛑 已停止所有音效')
}

const setMasterVolume = (volume) => {
  masterVolume.value = volume
  updateMasterVolume()
}

const updateMasterVolume = () => {
  // 更新所有活跃播放器的音量
  players.forEach((player) => {
    try {
      player.setVolume(masterVolume.value)
    } catch (error) {
      console.warn('设置音量失败:', error)
    }
  })
  
  addLog(`🔊 主音量设置为 ${Math.round(masterVolume.value * 100)}%`)
}

const clearLog = () => {
  logs.value = []
  addLog('🗑️ 日志已清除')
}

// 生命周期
onUnmounted(() => {
  stopAllSounds()
})

// 初始化日志
addLog('🎵 音效面板初始化完成')
</script>

<style scoped>
.sound-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 15px;
  margin: 20px 0;
}

.sound-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 20px 10px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.sound-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

.sound-btn.playing {
  background: rgba(76, 175, 80, 0.3);
  border-color: #4CAF50;
  animation: pulse 0.6s ease-in-out;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.sound-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.sound-name {
  font-size: 12px;
  font-weight: bold;
}

.log-panel {
  margin: 20px 0;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 15px;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-weight: bold;
}

.log-content {
  max-height: 150px;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  font-size: 11px;
}

.log-entry {
  margin: 3px 0;
  padding: 2px 0;
}

.log-time {
  opacity: 0.6;
  font-size: 10px;
}
</style>