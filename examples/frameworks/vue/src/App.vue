<template>
  <div class="app">
    <div class="container">
      <header class="header">
        <h1>🎵 Vue.js 集成示例</h1>
        <p>演示如何在Vue.js项目中使用WeChat H5 Audio Player</p>
      </header>

      <div class="examples-grid">
        <!-- 基础播放器 -->
        <BasicPlayer />
        
        <!-- 播放列表 -->
        <PlaylistPlayer />
        
        <!-- 音效面板 -->
        <SoundEffects />
      </div>
    </div>
  </div>
</template>

<script setup>
import BasicPlayer from './components/BasicPlayer.vue'
import PlaylistPlayer from './components/PlaylistPlayer.vue'
import SoundEffects from './components/SoundEffects.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  color: white;
  padding: 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.header p {
  font-size: 1.1rem;
  opacity: 0.9;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
}

.card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.card h3 {
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  padding: 10px 20px;
  border-radius: 15px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  margin: 5px;
}

.btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn.primary {
  background: rgba(76, 175, 80, 0.3);
}

.btn.danger {
  background: rgba(244, 67, 54, 0.3);
}

.status {
  padding: 10px;
  border-radius: 10px;
  margin: 10px 0;
  font-size: 14px;
}

.status.info { background: rgba(33, 150, 243, 0.3); }
.status.success { background: rgba(76, 175, 80, 0.3); }
.status.warning { background: rgba(255, 193, 7, 0.3); }
.status.error { background: rgba(244, 67, 54, 0.3); }

.controls {
  display: flex;
  gap: 10px;
  margin: 15px 0;
  flex-wrap: wrap;
}

.volume-control {
  margin: 15px 0;
}

.volume-slider {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  outline: none;
  background: rgba(255, 255, 255, 0.3);
  margin: 10px 0;
}

.info-panel {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 15px;
  margin: 15px 0;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
}
</style>