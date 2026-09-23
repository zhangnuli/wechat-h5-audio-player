# WeChat H5 Audio Player

用于微信 H5 页面的音频播放器，支持播放控制、循环、音量设置和 TypeScript。内置 SoundJS，无需单独引入 SoundJS 脚本。

## 安装

```bash
npm install wechat-h5-audio-player
```

## 快速使用

将音频放到网站的 `/audio/background.mp3`，或将 `src` 替换为你的音频地址。在浏览器页面初始化时创建播放器：

```typescript
import { WechatAudioPlayer } from 'wechat-h5-audio-player'

const player = new WechatAudioPlayer({
  src: '/audio/background.mp3',
  autoplay: true,
  loop: true,
  onReady: () => console.log('音频已加载'),
  onError: (error) => console.error('音频错误：', error.message)
})
```

`autoplay: true` 表示加载后尝试自动播放。Android 微信使用上面的基础配置；接入 iOS 微信自动播放时，必须配置微信 JS-SDK，见下方示例。

## 微信配置怎么选？

| 场景 | 配置 |
| --- | --- |
| 基础播放、Android 微信自动播放 | 使用上面的基础配置 |
| iOS 微信自动播放 | 必须启用 JSSDK，并传入后端返回的完整签名 |
| 需要由播放器初始化微信 JS-SDK | 传入 `weixinConfig` 和后端返回的签名 |

**本 SDK 的 iOS 微信自动播放接入要求：** 设置 `autoplay: true`，同时提供 `weixinConfig.enableJSSDK: true` 和完整的 `jssdkConfig`。Android 微信无需为自动播放额外配置 JSSDK。

### 接入微信 JS-SDK

以下是 iOS 微信自动播放的接入配置。`/api/wechat/signature` 是业务接口示例，需要由你的后端提供：

```typescript
import { WechatAudioPlayer } from 'wechat-h5-audio-player'

async function createPlayer() {
  const url = window.location.href.split('#')[0]
  const response = await fetch(
    '/api/wechat/signature?url=' + encodeURIComponent(url)
  )
  if (!response.ok) throw new Error('获取微信签名失败')
  const config = await response.json()

  return new WechatAudioPlayer({
    src: '/audio/background.mp3',
    autoplay: true,
    loop: true,
    weixinConfig: {
      enableJSSDK: true,
      jssdkConfig: {
        appId: config.appId,
        timestamp: String(config.timestamp),
        nonceStr: config.nonceStr,
        signature: config.signature,
        jsApiList: []
      }
    },
    onError: (error) => console.error(error.message)
  })
}

createPlayer().catch(console.error)
```

| 参数 | 来源 |
| --- | --- |
| `appId` | 业务使用的微信 AppID |
| `timestamp` | 后端生成签名时的时间戳；SDK 接收字符串 |
| `nonceStr` | 后端生成签名时的随机串 |
| `signature` | 后端为当前页面生成的签名 |
| `jsApiList` | 业务需要的微信接口列表，可传空数组 |

本包不提供签名服务。上述配置是接入要求，不代表当前版本已保证 iOS 自动播放成功；请在目标设备验证播放效果。

## 播放控制

手动调用 `play()` 前先等待 `ready`。以下方法按需调用：

| 方法 | 用途 |
| --- | --- |
| `await player.play()` | 发起播放，使用 `try/catch` 处理失败 |
| `player.pause()` | 暂停 |
| `player.stop()` | 停止 |
| `player.setVolume(0.5)` | 设置音量，范围 0～1 |
| `player.setMuted(true)` | 静音 |
| `player.getStatus()` | 查询状态、时间和环境信息 |
| `player.destroy()` | 页面卸载时释放播放器 |

背景音乐建议在创建时设置 `loop: true`。使用 Vue / React 时，在浏览器挂载后初始化，并在组件卸载时调用 `destroy()`。

## 常用配置

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `src` | 必填 | 可访问的音频地址 |
| `autoplay` | `false` | 是否尝试自动播放 |
| `loop` | `false` | 是否循环 |
| `volume` | `0.8` | 音量，范围 0～1 |
| `muted` | `false` | 是否静音 |
| `debug` | `false` | 额外调试日志 |
| `weixinConfig` | 不启用 JSSDK | iOS 微信自动播放接入必填；Android 基础播放可省略 |

## 更多文档

- [接入指南](./docs/QUICKSTART.md)
- [API 参考](./docs/API.md)
- [常见问题](./docs/TROUBLESHOOTING.md)

## 许可证

[MIT](./LICENSE)
