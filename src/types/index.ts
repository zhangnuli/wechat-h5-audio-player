/**
 * 类型定义文件
 * 
 * @description 定义了WechatAudioPlayer的所有接口、类型和配置选项
 * @author Claude
 * @since 2.0.0
 */

/**
 * 播放器状态枚举
 */
export type PlayerState = 
  | 'idle'        // 空闲状态
  | 'loading'     // 加载中
  | 'ready'       // 准备就绪
  | 'playing'     // 播放中
  | 'paused'      // 暂停
  | 'stopped'     // 停止
  | 'error'       // 错误状态

/**
 * 播放器事件定义
 */
export interface PlayerEvents {
  /** 播放器准备就绪 */
  ready: []
  /** 开始播放 */
  play: []
  /** 暂停播放 */
  pause: []
  /** 停止播放 */
  stop: []
  /** 播放结束 */
  ended: []
  /** 音量变化 */
  volumechange: [volume: number]
  /** 播放进度更新 */
  timeupdate: [currentTime: number, duration: number]
  /** 加载进度 */
  progress: [loaded: number, total: number]
  /** 错误事件 */
  error: [error: Error]
  /** 状态变化 */
  statechange: [state: PlayerState]
}

/**
 * 事件监听器类型
 */
export type EventListener<T extends keyof PlayerEvents> = (...args: PlayerEvents[T]) => void

/**
 * 音频加载选项
 */
export interface AudioLoadOptions {
  /** 音频ID，用于SoundJS注册 */
  id?: string
  /** 是否预加载 */
  preload?: boolean
  /** 音频格式列表 */
  formats?: string[]
  /** 加载超时时间（毫秒） */
  timeout?: number
}

/**
 * 微信环境配置
 */
export interface WeixinConfig {
  /** 是否启用微信JSSDK */
  enableJSSDK?: boolean
  /** 微信JSSDK配置 */
  jssdkConfig?: {
    appId: string
    timestamp: string
    nonceStr: string
    signature: string
    jsApiList?: string[]
    debug?: boolean
  }
}

/**
 * 播放器配置选项
 */
export interface WechatAudioConfig {
  /** 
   * 音频源URL
   * @example 'https://example.com/music.mp3'
   */
  src: string

  /** 
   * 是否自动播放
   * @default false
   * @description 在微信环境下，配合WeixinJSBridgeReady可实现真正的自动播放
   */
  autoplay?: boolean

  /** 
   * 是否循环播放
   * @default false
   */
  loop?: boolean

  /** 
   * 音量大小
   * @default 0.8
   * @min 0
   * @max 1
   */
  volume?: number

  /** 
   * 是否静音
   * @default false
   */
  muted?: boolean

  /** 
   * 音频加载选项
   */
  loadOptions?: AudioLoadOptions

  /** 
   * 微信环境配置
   */
  weixinConfig?: WeixinConfig

  /** 
   * 是否启用调试模式
   * @default false
   */
  debug?: boolean

  /** 
   * SoundJS CDN地址
   * @default 'https://code.createjs.com/1.0.0/soundjs.min.js'
   */
  soundjsCDN?: string

  // 事件回调函数
  onReady?: () => void
  onPlay?: () => void
  onPause?: () => void
  onStop?: () => void
  onEnded?: () => void
  onError?: (error: Error) => void
  onVolumeChange?: (volume: number) => void
  onTimeUpdate?: (currentTime: number, duration: number) => void
}

/**
 * 播放器状态信息
 */
export interface PlayerStatus {
  /** 当前状态 */
  state: PlayerState
  /** 是否正在播放 */
  isPlaying: boolean
  /** 当前音量 */
  volume: number
  /** 是否静音 */
  muted: boolean
  /** 是否循环播放 */
  loop: boolean
  /** 当前播放时间（秒） */
  currentTime: number
  /** 音频总时长（秒） */
  duration: number
  /** 加载进度（0-1） */
  loadProgress: number
  /** 环境信息 */
  environment: EnvironmentInfo
}

/**
 * 环境检测信息
 */
export interface EnvironmentInfo {
  /** 是否为微信环境 */
  isWeixin: boolean
  /** 是否为iOS设备 */
  isIOS: boolean
  /** 是否为Android设备 */
  isAndroid: boolean
  /** 是否为HTTPS协议 */
  isHTTPS: boolean
  /** 用户代理字符串 */
  userAgent: string
  /** 微信版本号 */
  weixinVersion?: string
  /** 是否支持自动播放 */
  supportsAutoplay: boolean
  /** 浏览器类型 */
  browserType: 'weixin' | 'safari' | 'chrome' | 'firefox' | 'other'
}

/**
 * SoundJS全局声明
 */
declare global {
  interface Window {
    /** SoundJS库 */
    createjs?: {
      Sound: {
        /** 注册音频文件 */
        registerSound: (src: string, id: string) => void
        /** 播放音频 */
        play: (id: string, options?: { loop?: number; volume?: number }) => SoundInstance | null
        /** 停止所有音频 */
        stop: () => void
        /** 移除音频 */
        removeSound: (id: string) => void
        /** 移除所有音频 */
        removeAllSounds: () => void
        /** 设置音量 */
        setVolume: (volume: number) => void
        /** 获取音量 */
        getVolume: () => number
        /** 事件监听 */
        on: (event: string, handler: Function, scope?: any) => void
        /** 移除事件监听 */
        off: (event: string, handler: Function, scope?: any) => void
        /** 支持的音频格式 */
        alternateExtensions: string[]
      }
    }
    
    /** 微信JSBridge */
    WeixinJSBridge?: {
      invoke: (method: string, params: any, callback?: (result: any) => void) => void
      call: (method: string, params: any) => void
      on: (event: string, callback: (result: any) => void) => void
    }

    /** 微信JSSDK */
    wx?: {
      config: (config: any) => void
      ready: (callback: () => void) => void
      error: (callback: (err: any) => void) => void
    }
  }
}

/**
 * SoundJS音频实例接口
 */
export interface SoundInstance {
  /** 播放 */
  play: () => SoundInstance
  /** 暂停 */
  pause: () => SoundInstance
  /** 停止 */
  stop: () => SoundInstance
  /** 设置音量 */
  setVolume: (volume: number) => SoundInstance
  /** 获取音量 */
  getVolume: () => number
  /** 设置位置 */
  setPosition: (position: number) => SoundInstance
  /** 获取位置 */
  getPosition: () => number
  /** 设置循环 */
  setLoop: (loop: number) => SoundInstance
  /** 获取时长 */
  getDuration: () => number
  /** 事件监听 */
  on: (event: string, handler: Function, scope?: any) => void
  /** 移除事件监听 */
  off: (event: string, handler: Function, scope?: any) => void
  /** 销毁 */
  destroy: () => void
}