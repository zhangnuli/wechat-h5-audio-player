# API 参考

## 创建实例

```typescript
import { WechatAudioPlayer } from 'wechat-h5-audio-player'

const player = new WechatAudioPlayer({
  src: '/audio/background.mp3',
  autoplay: true,
  loop: true
})
```

构造函数开始异步初始化。手动播放应等待 `ready`，销毁后不能继续使用该实例。

## 配置

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `src` | 必填 | 音频 URL，字符串 |
| `autoplay` | `false` | 尝试自动播放 |
| `loop` | `false` | 循环播放 |
| `volume` | `0.8` | 音量，0～1 |
| `muted` | `false` | 静音 |
| `debug` | `false` | 额外调试日志 |
| `loadOptions` | 见下文 | 加载选项 |
| `weixinConfig` | 不启用 JSSDK | iOS 微信自动播放接入必填；Android 基础播放可省略 |
| `soundjsCDN` | 内置默认地址 | 兼容字段；使用内置 SoundJS，无需设置 |

### loadOptions

| 字段 | 默认值 | 说明 |
| --- | --- | --- |
| `id` | 自动生成 | 音频标识，多个播放器应使用不同标识 |
| `timeout` | `10000` | SoundJS 加载等待超时，毫秒 |
| `preload` | `true` | 保留配置，当前不控制加载流程 |
| `formats` | `['mp3', 'ogg', 'wav']` | 保留配置，当前不按此字段选择格式 |

### weixinConfig

本 SDK 要求 iOS 微信自动播放接入提供 `enableJSSDK: true` 和完整签名配置。Android 基础播放可省略。类型中保留可选字段，以支持不同使用场景：

```typescript
interface WeixinConfig {
  enableJSSDK?: boolean
  jssdkConfig?: {
    appId: string
    timestamp: string
    nonceStr: string
    signature: string
    jsApiList?: string[]
    debug?: boolean
  }
}
```

`enableJSSDK` 默认是 `false`。签名参数由后端返回，见 [接入示例](../README.md#接入微信-js-sdk)。此配置不保证自动播放成功。

## 实例方法

| 方法 | 返回值 | 说明 |
| --- | --- | --- |
| `play()` | `Promise<void>` | 发起播放；失败时捕获异常 |
| `pause()` | `void` | 暂停 |
| `stop()` | `void` | 停止 |
| `setVolume(volume)` | `void` | 音量 0～1 |
| `getVolume()` | `number` | 配置音量 |
| `setMuted(muted)` | `void` | 设置静音 |
| `isMuted()` | `boolean` | 静音配置 |
| `setLoop(loop)` | `void` | 修改循环配置 |
| `isLoop()` | `boolean` | 循环配置 |
| `getCurrentTime()` | `number` | 播放时间，秒 |
| `getDuration()` | `number` | 总时长，秒；不可用时返回 0 |
| `getStatus()` | `PlayerStatus` | 当前状态 |
| `on(event, listener)` | `void` | 添加监听 |
| `off(event, listener)` | `void` | 移除同一个监听函数 |
| `destroy()` | `void` | 释放播放器 |

SoundJS 路径再次调用 `play()` 会创建新实例，不应当作从暂停位置续播。`setLoop()` 不立即更新正在播放的实例，建议创建播放器时设置循环。

## 回调与事件

| 配置回调 | 事件 | 参数 |
| --- | --- | --- |
| `onReady` | `ready` | 无 |
| `onPlay` | `play` | 无 |
| `onPause` | `pause` | 无 |
| `onStop` | `stop` | 无 |
| `onEnded` | `ended` | 无 |
| `onError` | `error` | `Error` |
| `onVolumeChange` | `volumechange` | 音量 |
| 无 | `statechange` | 状态字符串 |

```typescript
const handleError = (error: Error) => console.error(error.message)
player.on('error', handleError)
// 不再需要监听时，使用同一个函数引用：
player.off('error', handleError)
```

类型包含 `onTimeUpdate` / `timeupdate` 和 `progress`，当前版本未发送这些事件。读取进度请用 `getCurrentTime()` 和 `getDuration()`。

## 状态查询

`getStatus()` 返回：

- `state`：idle、loading、ready、playing、paused、stopped 或 error。
- `isPlaying`：播放器记录的播放状态。
- `volume`、`muted`、`loop`：当前配置。
- `currentTime`、`duration`：秒。
- `loadProgress`：未加载完成为 0，完成为 1。
- `environment`：系统、微信、浏览器与协议等信息。

`environment.supportsAutoplay` 是环境判断值，不是播放能力测试结果。`onPlay` 和 `isPlaying` 也不能单独证明设备实际发声。
