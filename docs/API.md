# 📋 API 参考手册

## 目录

- [核心类](#核心类)
- [配置接口](#配置接口)
- [实例方法](#实例方法)
- [事件系统](#事件系统)
- [类型定义](#类型定义)
- [静态工具](#静态工具)

## 核心类

### WechatAudioPlayer

主要播放器类，提供完整的音频播放功能。

```typescript
class WechatAudioPlayer {
  constructor(config: WechatAudioConfig)
  
  // 播放控制
  play(): Promise<void>
  pause(): void
  stop(): void
  
  // 音量控制
  setVolume(volume: number): void
  getVolume(): number
  setMuted(muted: boolean): void
  isMuted(): boolean
  
  // 播放模式
  setLoop(loop: boolean): void
  isLoop(): boolean
  
  // 状态查询
  getCurrentTime(): number
  getDuration(): number
  getStatus(): PlayerStatus
  
  // 事件系统
  on(event: string, listener: Function): void
  off(event: string, listener: Function): void
  
  // 生命周期
  destroy(): void
}
```

### SoundJSBundle

内置的SoundJS管理类，负责音频引擎初始化。

```typescript
class SoundJSBundle {
  static isInitialized(): boolean
  static initialize(): void
  static getVersion(): string
  static reset(): void
}
```

## 配置接口

### WechatAudioConfig

播放器主要配置接口。

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

音频加载配置选项。

```typescript
interface AudioLoadOptions {
  id?: string                  // 音频ID，默认自动生成
  preload?: boolean           // 预加载，默认true
  formats?: string[]          // 支持格式，默认['mp3','ogg','wav']  
  timeout?: number            // 加载超时，默认10000ms
}
```

### WeixinConfig

微信环境专用配置。

```typescript
interface WeixinConfig {
  enableJSSDK?: boolean       // 启用微信JSSDK，默认false
  jssdkConfig?: {            // JSSDK配置（可选）
    appId: string            // 微信AppID
    timestamp: string        // 时间戳
    nonceStr: string         // 随机字符串
    signature: string        // 签名
    jsApiList?: string[]     // JS接口列表
  }
}
```

## 实例方法

### 播放控制方法

#### `play(): Promise<void>`

播放音频。

**返回值**: `Promise<void>` - 播放操作的Promise

**示例**:
```typescript
try {
  await player.play()
  console.log('播放成功')
} catch (error) {
  console.error('播放失败:', error)
}
```

#### `pause(): void`

暂停播放。

**示例**:
```typescript
player.pause()
```

#### `stop(): void`

停止播放并重置播放位置。

**示例**:
```typescript
player.stop()
```

### 音量控制方法

#### `setVolume(volume: number): void`

设置音量。

**参数**:
- `volume: number` - 音量值，范围 0-1

**示例**:
```typescript
player.setVolume(0.5)  // 设置音量为50%
```

#### `getVolume(): number`

获取当前音量。

**返回值**: `number` - 当前音量值

**示例**:
```typescript
const currentVolume = player.getVolume()
console.log('当前音量:', Math.round(currentVolume * 100) + '%')
```

#### `setMuted(muted: boolean): void`

设置静音状态。

**参数**:
- `muted: boolean` - 是否静音

**示例**:
```typescript
player.setMuted(true)   // 静音
player.setMuted(false)  // 取消静音
```

#### `isMuted(): boolean`

获取静音状态。

**返回值**: `boolean` - 是否静音

**示例**:
```typescript
const isMuted = player.isMuted()
console.log('是否静音:', isMuted)
```

### 播放模式方法

#### `setLoop(loop: boolean): void`

设置循环播放。

**参数**:
- `loop: boolean` - 是否循环播放

**示例**:
```typescript
player.setLoop(true)   // 开启循环
player.setLoop(false)  // 关闭循环
```

#### `isLoop(): boolean`

获取循环状态。

**返回值**: `boolean` - 是否循环播放

**示例**:
```typescript
const isLooping = player.isLoop()
console.log('是否循环:', isLooping)
```

### 状态查询方法

#### `getCurrentTime(): number`

获取当前播放时间。

**返回值**: `number` - 当前播放时间（秒）

**示例**:
```typescript
const currentTime = player.getCurrentTime()
console.log('当前播放时间:', currentTime + '秒')
```

#### `getDuration(): number`

获取音频总时长。

**返回值**: `number` - 音频总时长（秒）

**示例**:
```typescript
const duration = player.getDuration()
console.log('音频总时长:', duration + '秒')
```

#### `getStatus(): PlayerStatus`

获取完整状态信息。

**返回值**: `PlayerStatus` - 播放器状态对象

**示例**:
```typescript
const status = player.getStatus()
console.log('播放器状态:', {
  state: status.state,
  isPlaying: status.isPlaying,
  currentTime: status.currentTime,
  duration: status.duration,
  volume: status.volume,
  environment: status.environment
})
```

### 事件系统方法

#### `on(event: string, listener: Function): void`

添加事件监听器。

**参数**:
- `event: string` - 事件名称
- `listener: Function` - 事件处理函数

**示例**:
```typescript
player.on('play', () => {
  console.log('播放开始')
})

player.on('timeupdate', (currentTime) => {
  console.log('播放进度:', currentTime)
})
```

#### `off(event: string, listener: Function): void`

移除事件监听器。

**参数**:
- `event: string` - 事件名称
- `listener: Function` - 要移除的事件处理函数

**示例**:
```typescript
const playHandler = () => console.log('播放开始')

player.on('play', playHandler)    // 添加监听
player.off('play', playHandler)   // 移除监听
```

### 生命周期方法

#### `destroy(): void`

销毁播放器实例，释放所有资源。

**示例**:
```typescript
player.destroy()
console.log('播放器已销毁')
```

## 事件系统

### 事件列表

| 事件名 | 参数 | 描述 | 触发时机 |
|--------|------|------|----------|
| `ready` | - | 播放器准备就绪 | 音频加载完成，可以播放 |
| `play` | - | 开始播放 | 调用play()方法成功时 |
| `pause` | - | 暂停播放 | 调用pause()方法时 |
| `stop` | - | 停止播放 | 调用stop()方法时 |
| `ended` | - | 播放结束 | 音频播放完成时（非循环） |
| `volumechange` | `volume: number` | 音量变化 | 音量设置改变时 |
| `timeupdate` | `currentTime: number` | 播放进度更新 | 播放过程中定期触发 |
| `error` | `error: Error` | 播放错误 | 发生播放错误时 |
| `statechange` | `state: PlayerState` | 状态变化 | 播放器状态改变时 |

### 事件使用示例

```typescript
const player = new WechatAudioPlayer({
  src: 'audio.mp3',
  
  // 配置中的事件回调
  onReady: () => console.log('配置回调: 准备就绪'),
  onPlay: () => console.log('配置回调: 开始播放')
})

// 独立的事件监听
player.on('ready', () => {
  console.log('事件监听: 准备就绪')
})

player.on('timeupdate', (currentTime) => {
  const progress = (currentTime / player.getDuration()) * 100
  console.log(`播放进度: ${progress.toFixed(1)}%`)
})

player.on('error', (error) => {
  console.error('播放错误:', error.message)
  // 可以在这里实现重试逻辑
})
```

## 类型定义

### PlayerState

播放器状态枚举。

```typescript
type PlayerState = 
  | 'idle'      // 空闲状态
  | 'loading'   // 加载中
  | 'ready'     // 准备就绪
  | 'playing'   // 播放中
  | 'paused'    // 已暂停
  | 'stopped'   // 已停止
  | 'error'     // 错误状态
```

### PlayerStatus

播放器状态信息接口。

```typescript
interface PlayerStatus {
  state: PlayerState           // 当前状态
  isPlaying: boolean          // 是否正在播放
  volume: number              // 当前音量 (0-1)
  muted: boolean              // 是否静音
  loop: boolean               // 是否循环播放
  currentTime: number         // 当前播放时间（秒）
  duration: number            // 音频总时长（秒）
  loadProgress: number        // 加载进度 (0-1)
  environment: EnvironmentInfo // 环境信息
}
```

### EnvironmentInfo

环境信息接口。

```typescript
interface EnvironmentInfo {
  isWeixin: boolean           // 是否微信环境
  isIOS: boolean              // 是否iOS设备
  isAndroid: boolean          // 是否Android设备
  isHTTPS: boolean            // 是否HTTPS协议
  supportsAutoplay: boolean   // 是否支持自动播放
  browserType: string         // 浏览器类型 ('weixin'|'safari'|'chrome'|'other')
  userAgent: string           // User Agent字符串
  weixinVersion?: string      // 微信版本（如果是微信环境）
}
```

## 静态工具

### SoundJSBundle 静态方法

用于管理内置的SoundJS库。

```typescript
// 检查是否已初始化
SoundJSBundle.isInitialized(): boolean

// 手动初始化SoundJS（通常不需要调用）
SoundJSBundle.initialize(): void

// 获取SoundJS版本
SoundJSBundle.getVersion(): string

// 重置SoundJS状态
SoundJSBundle.reset(): void
```

### 使用示例

```typescript
// 检查SoundJS状态
if (SoundJSBundle.isInitialized()) {
  console.log('SoundJS版本:', SoundJSBundle.getVersion())
} else {
  console.log('SoundJS未初始化')
}
```

## 最佳实践

### 错误处理

```typescript
const player = new WechatAudioPlayer({
  src: 'audio.mp3',
  autoplay: true,
  
  onError: (error) => {
    console.error('播放器错误:', error.message)
    
    // 根据错误类型进行处理
    if (error.message.includes('load')) {
      console.log('音频加载失败，可能是网络问题')
    } else if (error.message.includes('autoplay')) {
      console.log('自动播放被阻止，需要用户交互')
    }
  }
})
```

### 性能优化

```typescript
// 在页面卸载时销毁播放器
window.addEventListener('beforeunload', () => {
  player.destroy()
})

// 在单页应用中的路由切换时
router.beforeEach(() => {
  if (player) {
    player.destroy()
  }
})
```

### 状态监控

```typescript
// 定期监控播放器状态
setInterval(() => {
  const status = player.getStatus()
  
  if (status.state === 'error') {
    console.error('播放器处于错误状态')
    // 实现重试逻辑
  }
  
  if (status.isPlaying) {
    const progress = (status.currentTime / status.duration) * 100
    updateProgressBar(progress)
  }
}, 1000)
```