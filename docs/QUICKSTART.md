# 接入指南

## 安装与自动播放

```bash
npm install wechat-h5-audio-player
```

在浏览器中创建播放器，替换为你自己的音频地址：

```typescript
import { WechatAudioPlayer } from 'wechat-h5-audio-player'

const player = new WechatAudioPlayer({
  src: '/audio/background.mp3',
  autoplay: true,
  loop: true,
  onReady: () => console.log('音频已加载'),
  onError: (error) => console.error(error.message)
})
```

Android 微信使用此配置即可发起自动播放。接入 iOS 微信自动播放时，必须额外提供 `weixinConfig.enableJSSDK: true` 和后端生成的完整 `jssdkConfig`，参考 [完整配置示例](../README.md#接入微信-js-sdk)。配置完成后仍需在目标设备验证，当前版本不保证所有 iOS 微信环境自动播放成功。

## 手动播放

如果页面需要播放按钮，可以在音频加载完成后启用它。这个示例独立于上面的自动播放示例，按业务需要选择：

```html
<button id="play" disabled>播放</button>
```

```typescript
import { WechatAudioPlayer } from 'wechat-h5-audio-player'

const button = document.querySelector<HTMLButtonElement>('#play')!
const player = new WechatAudioPlayer({
  src: '/audio/background.mp3',
  onReady: () => { button.disabled = false },
  onError: (error) => console.error(error.message)
})

button.addEventListener('click', () => {
  player.play().catch(console.error)
})
```

## 框架项目

在 Vue 的挂载回调或 React 的 effect 中创建实例，避免在服务端渲染期间执行。在组件卸载回调中释放资源：

```typescript
player.destroy()
```

## 验证效果

部署后，用目标手机在微信中打开页面，确认声音和播放进度。需要排查时设置 `debug: true`，记录 `onError` 输出，参见 [常见问题](./TROUBLESHOOTING.md)。
