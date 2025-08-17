/**
 * WeChat H5 Audio Player
 * 
 * 基于SoundJS实现的微信H5音频播放器，支持iOS和Android微信环境的真正自动播放
 * 
 * @description 核心技术：
 * - 使用SoundJS库进行音频管理
 * - 在WeixinJSBridgeReady事件中注册音频源
 * - 支持微信环境下的无交互自动播放
 * - 提供完整的播放控制API
 * 
 * @example
 * ```typescript
 * import { WechatAudioPlayer } from 'wechat-h5-audio-player'
 * 
 * const player = new WechatAudioPlayer({
 *   src: 'https://example.com/music.mp3',
 *   autoplay: true,
 *   loop: true
 * })
 * 
 * player.on('ready', () => console.log('播放器准备就绪'))
 * player.on('play', () => console.log('开始播放'))
 * ```
 * 
 * @author Claude
 * @version 2.0.0
 * @license MIT
 */

export { WechatAudioPlayer } from './core/WechatAudioPlayer'
export { SoundJSBundle } from './vendor/soundjs-bundle'
export type { 
  WechatAudioConfig, 
  PlayerState, 
  PlayerEvents,
  AudioLoadOptions,
  PlayerStatus
} from './types'

// 默认导出
export { WechatAudioPlayer as default } from './core/WechatAudioPlayer'