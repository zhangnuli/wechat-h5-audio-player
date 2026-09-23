# 常见问题

## iOS 微信必须传 weixinConfig 吗？

接入本 SDK 的 iOS 微信自动播放时必须提供。设置 `autoplay: true`，同时传入 `weixinConfig.enableJSSDK: true` 和后端返回的完整 `jssdkConfig`，见 [接入示例](../README.md#接入微信-js-sdk)。Android 微信基础播放无需额外配置 JSSDK。

这是 SDK 接入要求，不代表配置后必然播放成功。当前版本仍需在目标 iOS 微信设备上验证。

## Android 可以播放，iOS 没有声音怎么办？

确认两台设备使用同一个页面和音频地址，并检查：

1. 实际加载的 SDK 版本，排除网页缓存仍使用旧文件。
2. 音频请求是否成功，返回的是否为音频文件。
3. `muted` 是否为 `true`、`volume` 是否为 0，以及设备媒体音量。
4. 设置 `debug: true`，记录日志、`onError` 和播放进度。

不要仅凭 `onPlay` 或 `isPlaying` 判断设备已发声。反馈问题时附上 iOS 版本、微信版本和页面入口，有助于复现。

## 微信签名从哪里获取？

由业务后端生成并返回 `appId`、`timestamp`、`nonceStr`、`signature`。本包不提供签名接口，示例接口需替换为自己的服务。

签名校验失败时，核对前端提交的页面地址与后端签名地址、参数是否属于同一次签名，以及业务的微信 JSSDK 域名配置。

## 提示 Audio not loaded yet

`play()` 调用早于音频加载完成。等待 `onReady` / `ready` 后再手动播放。启用 `autoplay` 时无需在创建实例后立即再调用 `play()`。

## 音频加载失败或超时

检查请求状态码、响应内容和文件格式，确认返回的是音频而不是登录页或错误页。跨域请求如出现 CORS 错误，需要资源服务器允许访问；HTTPS 页面应使用 HTTPS 音频地址。

## 如何提交问题？

提供 SDK 版本、设备与微信版本、可复现页面、精简配置和错误日志。请勿附带微信 AppSecret、access_token、jsapi_ticket 或 npm Token。
