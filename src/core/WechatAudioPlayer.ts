/**
 * 微信H5音频播放器核心类
 * 
 * @description 基于SoundJS实现的微信H5音频播放器，支持iOS和Android微信环境的真正自动播放
 * 
 * 核心技术实现：
 * 1. 使用SoundJS库进行音频管理
 * 2. 在WeixinJSBridgeReady事件中注册音频源（关键！）
 * 3. 支持微信环境下的无交互自动播放
 * 4. 提供完整的播放控制API和事件系统
 * 
 * @author Claude
 * @since 2.0.0
 * 
 * @example
 * ```typescript
 * const player = new WechatAudioPlayer({
 *   src: 'https://example.com/music.mp3',
 *   autoplay: true,
 *   loop: true,
 *   volume: 0.8,
 *   onReady: () => console.log('播放器准备就绪'),
 *   onPlay: () => console.log('开始播放')
 * })
 * ```
 */

import type { 
  WechatAudioConfig, 
  PlayerState, 
  PlayerEvents, 
  EventListener, 
  PlayerStatus,
  EnvironmentInfo,
  SoundInstance
} from '../types'
import { SoundJSBundle } from '../vendor/soundjs-bundle'

/**
 * 微信H5音频播放器类
 */
export class WechatAudioPlayer {
  /** 播放器配置 */
  private readonly config: Required<WechatAudioConfig>
  
  /** 当前播放状态 */
  private state: PlayerState = 'idle'
  
  /** SoundJS音频实例 */
  private soundInstance: SoundInstance | null = null
  
  /** 音频ID（用于SoundJS注册） */
  private readonly audioId: string
  
  /** 是否已销毁 */
  private destroyed = false
  
  /** 事件监听器映射 */
  private readonly eventListeners = new Map<keyof PlayerEvents, Set<Function>>()
  
  /** 环境信息 */
  private environmentInfo: EnvironmentInfo
  
  /** 音频加载完成标志 */
  private audioLoaded = false
  
  /** WeixinJSBridgeReady事件是否已触发 */
  private weixinReady = false

  /**
   * 构造函数
   * 
   * @param config - 播放器配置选项
   * 
   * @throws {Error} 当配置无效时抛出错误
   */
  constructor(config: WechatAudioConfig) {
    // 验证必需配置
    if (!config.src || typeof config.src !== 'string') {
      throw new Error('Audio source (src) is required and must be a valid URL')
    }

    // 合并默认配置
    this.config = {
      src: config.src,
      autoplay: config.autoplay ?? false,
      loop: config.loop ?? false,
      volume: config.volume ?? 0.8,
      muted: config.muted ?? false,
      loadOptions: {
        id: `audio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        preload: true,
        formats: ['mp3', 'ogg', 'wav'],
        timeout: 10000,
        ...config.loadOptions
      },
      weixinConfig: {
        enableJSSDK: false,
        ...config.weixinConfig
      },
      debug: config.debug ?? false,
      soundjsCDN: config.soundjsCDN ?? 'https://code.createjs.com/1.0.0/soundjs.min.js',
      onReady: config.onReady ?? (() => {}),
      onPlay: config.onPlay ?? (() => {}),
      onPause: config.onPause ?? (() => {}),
      onStop: config.onStop ?? (() => {}),
      onEnded: config.onEnded ?? (() => {}),
      onError: config.onError ?? (() => {}),
      onVolumeChange: config.onVolumeChange ?? (() => {}),
      onTimeUpdate: config.onTimeUpdate ?? (() => {})
    }

    // 设置音频ID
    this.audioId = this.config.loadOptions.id!

    // 检测环境信息
    this.environmentInfo = this.detectEnvironment()

    // 绑定配置中的事件回调
    this.bindConfigCallbacks()

    // 开始初始化
    this.initialize()
  }

  /**
   * 初始化播放器
   * 
   * @private
   */
  private async initialize(): Promise<void> {
    try {
      this.setState('loading')
      this.log('info', 'Initializing WechatAudioPlayer...')

      // 1. 加载SoundJS库
      await this.loadSoundJS()

      // 2. 初始化微信JSSDK（如果需要）
      if (this.config.weixinConfig.enableJSSDK && this.environmentInfo.isWeixin) {
        await this.initWeixinJSSDK()
      }

      // 3. 设置微信环境的特殊处理
      if (this.environmentInfo.isWeixin) {
        await this.setupWeixinEnvironment()
      } else {
        // 非微信环境直接加载音频
        await this.loadAudio()
      }

    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      this.handleError(err)
    }
  }

  /**
   * 加载SoundJS库
   * 
   * @private
   */
  private async loadSoundJS(): Promise<void> {
    this.log('info', 'Loading SoundJS library...')
    
    try {
      SoundJSBundle.initialize()
      this.log('info', `SoundJS initialized successfully, version: ${SoundJSBundle.getVersion()}`)
      
      // 设置SoundJS事件监听
      this.setupSoundJSEventListeners()
      
    } catch (error) {
      throw new Error(`Failed to load SoundJS: ${error}`)
    }
  }

  /**
   * 设置SoundJS事件监听
   * 
   * @private
   */
  private setupSoundJSEventListeners(): void {
    if (!window.createjs?.Sound) return

    // 监听文件加载完成事件
    window.createjs.Sound.on('fileload', this.handleSoundLoad.bind(this), this)
    
    // 监听加载错误事件
    window.createjs.Sound.on('fileerror', this.handleSoundError.bind(this), this)
  }

  /**
   * 设置微信环境
   * 
   * @private
   * @description 这是关键！必须在WeixinJSBridgeReady事件中注册音频
   */
  private async setupWeixinEnvironment(): Promise<void> {
    this.log('info', 'Setting up WeChat environment...')

    return new Promise<void>((resolve) => {
      // 检查WeixinJSBridge是否已存在
      if (window.WeixinJSBridge) {
        this.log('info', 'WeixinJSBridge already available')
        this.weixinReady = true
        this.loadAudio().then(() => resolve())
        return
      }

      // 监听WeixinJSBridgeReady事件
      const handleWeixinReady = (): void => {
        this.log('info', 'WeixinJSBridgeReady event fired')
        this.weixinReady = true
        document.removeEventListener('WeixinJSBridgeReady', handleWeixinReady)
        
        // 在WeixinJSBridgeReady回调中注册音频（关键！）
        this.loadAudio().then(() => resolve())
      }

      document.addEventListener('WeixinJSBridgeReady', handleWeixinReady, false)

      // 设置超时保护
      setTimeout(() => {
        if (!this.weixinReady) {
          this.log('warn', 'WeixinJSBridgeReady timeout, fallback to direct load')
          document.removeEventListener('WeixinJSBridgeReady', handleWeixinReady)
          this.loadAudio().then(() => resolve())
        }
      }, 5000)
    })
  }

  /**
   * 加载音频文件
   * 
   * @private
   */
  private async loadAudio(): Promise<void> {
    if (!window.createjs?.Sound) {
      throw new Error('SoundJS not available')
    }

    this.log('info', `Loading audio: ${this.config.src}`)

    try {
      // 注册音频文件到SoundJS
      window.createjs.Sound.registerSound(this.config.src, this.audioId)
      
      // 设置加载超时
      const timeoutId = setTimeout(() => {
        if (!this.audioLoaded) {
          this.handleError(new Error('Audio load timeout'))
        }
      }, this.config.loadOptions.timeout!)

      // 等待加载完成
      await new Promise<void>((resolve, reject) => {
        const checkLoad = () => {
          if (this.audioLoaded) {
            clearTimeout(timeoutId)
            resolve()
          } else if (this.state === 'error') {
            clearTimeout(timeoutId)
            reject(new Error('Audio load failed'))
          } else {
            setTimeout(checkLoad, 100)
          }
        }
        checkLoad()
      })

    } catch (error) {
      throw new Error(`Failed to load audio: ${error}`)
    }
  }

  /**
   * SoundJS音频加载完成处理
   * 
   * @private
   */
  private handleSoundLoad(event: any): void {
    if (event.id === this.audioId) {
      this.audioLoaded = true
      this.setState('ready')
      this.log('info', 'Audio loaded successfully')
      
      // 触发ready事件
      this.emit('ready')
      
      // 如果配置了自动播放，开始播放
      if (this.config.autoplay) {
        this.play().catch(error => {
          this.log('warn', 'Autoplay failed:', error)
        })
      }
    }
  }

  /**
   * SoundJS音频加载错误处理
   * 
   * @private
   */
  private handleSoundError(event: any): void {
    if (event.id === this.audioId) {
      this.handleError(new Error(`Audio load error: ${event.message || 'Unknown error'}`))
    }
  }

  /**
   * 播放音频
   * 
   * @returns Promise，播放成功后resolve
   * 
   * @throws {Error} 当播放器已销毁或音频未加载时抛出错误
   * 
   * @example
   * ```typescript
   * try {
   *   await player.play()
   *   console.log('播放成功')
   * } catch (error) {
   *   console.error('播放失败:', error)
   * }
   * ```
   */
  public async play(): Promise<void> {
    if (this.destroyed) {
      throw new Error('Player has been destroyed')
    }

    if (!this.audioLoaded) {
      throw new Error('Audio not loaded yet')
    }

    if (!window.createjs?.Sound) {
      throw new Error('SoundJS not available')
    }

    try {
      this.log('info', 'Starting audio playback...')

      // 停止当前实例（如果有）
      if (this.soundInstance) {
        this.soundInstance.stop()
      }

      // 创建新的播放实例
      const playOptions = {
        loop: this.config.loop ? -1 : 0, // -1 表示无限循环
        volume: this.config.muted ? 0 : this.config.volume
      }

      this.soundInstance = window.createjs.Sound.play(this.audioId, playOptions)

      if (!this.soundInstance) {
        throw new Error('Failed to create sound instance')
      }

      // 设置音频实例事件监听
      this.setupSoundInstanceEvents()

      this.setState('playing')
      this.emit('play')
      this.log('info', '🎵 Audio playback started successfully')

    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      this.handleError(err)
      throw err
    }
  }

  /**
   * 暂停播放
   * 
   * @example
   * ```typescript
   * player.pause()
   * ```
   */
  public pause(): void {
    if (this.destroyed || !this.soundInstance) return

    try {
      this.soundInstance.pause()
      this.setState('paused')
      this.emit('pause')
      this.log('info', 'Audio paused')
    } catch (error) {
      this.log('error', 'Failed to pause audio:', error)
    }
  }

  /**
   * 停止播放
   * 
   * @example
   * ```typescript
   * player.stop()
   * ```
   */
  public stop(): void {
    if (this.destroyed || !this.soundInstance) return

    try {
      this.soundInstance.stop()
      this.setState('stopped')
      this.emit('stop')
      this.log('info', 'Audio stopped')
    } catch (error) {
      this.log('error', 'Failed to stop audio:', error)
    }
  }

  /**
   * 设置音量
   * 
   * @param volume - 音量值，范围0-1
   * 
   * @throws {Error} 当音量值无效时抛出错误
   * 
   * @example
   * ```typescript
   * player.setVolume(0.5) // 设置音量为50%
   * ```
   */
  public setVolume(volume: number): void {
    if (typeof volume !== 'number' || volume < 0 || volume > 1) {
      throw new Error('Volume must be a number between 0 and 1')
    }

    this.config.volume = volume

    if (this.soundInstance && !this.config.muted) {
      try {
        this.soundInstance.setVolume(volume)
      } catch (error) {
        this.log('error', 'Failed to set volume:', error)
      }
    }

    this.emit('volumechange', volume)
    this.log('debug', `Volume set to ${Math.round(volume * 100)}%`)
  }

  /**
   * 获取当前音量
   * 
   * @returns 当前音量值（0-1）
   */
  public getVolume(): number {
    return this.config.volume
  }

  /**
   * 设置静音状态
   * 
   * @param muted - 是否静音
   * 
   * @example
   * ```typescript
   * player.setMuted(true)  // 静音
   * player.setMuted(false) // 取消静音
   * ```
   */
  public setMuted(muted: boolean): void {
    this.config.muted = muted

    if (this.soundInstance) {
      try {
        const volume = muted ? 0 : this.config.volume
        this.soundInstance.setVolume(volume)
      } catch (error) {
        this.log('error', 'Failed to set muted state:', error)
      }
    }

    this.log('debug', muted ? 'Audio muted' : 'Audio unmuted')
  }

  /**
   * 获取静音状态
   * 
   * @returns 是否静音
   */
  public isMuted(): boolean {
    return this.config.muted
  }

  /**
   * 设置循环播放
   * 
   * @param loop - 是否循环播放
   * 
   * @example
   * ```typescript
   * player.setLoop(true) // 开启循环播放
   * ```
   */
  public setLoop(loop: boolean): void {
    this.config.loop = loop
    this.log('debug', loop ? 'Loop enabled' : 'Loop disabled')
  }

  /**
   * 获取循环播放状态
   * 
   * @returns 是否循环播放
   */
  public isLoop(): boolean {
    return this.config.loop
  }

  /**
   * 获取当前播放时间
   * 
   * @returns 当前播放时间（秒）
   */
  public getCurrentTime(): number {
    if (!this.soundInstance) return 0

    try {
      return this.soundInstance.getPosition() / 1000 // 转换为秒
    } catch {
      return 0
    }
  }

  /**
   * 获取音频总时长
   * 
   * @returns 音频总时长（秒）
   */
  public getDuration(): number {
    if (!this.soundInstance) return 0

    try {
      return this.soundInstance.getDuration() / 1000 // 转换为秒
    } catch {
      return 0
    }
  }

  /**
   * 获取播放器状态
   * 
   * @returns 完整的播放器状态信息
   */
  public getStatus(): PlayerStatus {
    return {
      state: this.state,
      isPlaying: this.state === 'playing',
      volume: this.config.volume,
      muted: this.config.muted,
      loop: this.config.loop,
      currentTime: this.getCurrentTime(),
      duration: this.getDuration(),
      loadProgress: this.audioLoaded ? 1 : 0,
      environment: this.environmentInfo
    }
  }

  /**
   * 添加事件监听器
   * 
   * @param event - 事件名称
   * @param listener - 事件处理函数
   * 
   * @example
   * ```typescript
   * player.on('play', () => console.log('开始播放'))
   * player.on('volumechange', (volume) => console.log('音量变化:', volume))
   * ```
   */
  public on<T extends keyof PlayerEvents>(event: T, listener: EventListener<T>): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set())
    }
    this.eventListeners.get(event)!.add(listener)
  }

  /**
   * 移除事件监听器
   * 
   * @param event - 事件名称
   * @param listener - 事件处理函数
   * 
   * @example
   * ```typescript
   * const handler = () => console.log('播放')
   * player.on('play', handler)
   * player.off('play', handler) // 移除监听器
   * ```
   */
  public off<T extends keyof PlayerEvents>(event: T, listener: EventListener<T>): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.delete(listener)
      if (listeners.size === 0) {
        this.eventListeners.delete(event)
      }
    }
  }

  /**
   * 销毁播放器
   * 
   * @description 清理所有资源，移除事件监听器
   * 
   * @example
   * ```typescript
   * player.destroy()
   * ```
   */
  public destroy(): void {
    if (this.destroyed) return

    this.log('info', 'Destroying player...')

    try {
      // 停止播放
      if (this.soundInstance) {
        this.soundInstance.stop()
        this.soundInstance.destroy()
        this.soundInstance = null
      }

      // 移除SoundJS中的音频
      if (window.createjs?.Sound && this.audioLoaded) {
        window.createjs.Sound.removeSound(this.audioId)
      }

      // 清理事件监听器
      this.eventListeners.clear()

      // 移除SoundJS事件监听
      if (window.createjs?.Sound) {
        window.createjs.Sound.off('fileload', this.handleSoundLoad, this)
        window.createjs.Sound.off('fileerror', this.handleSoundError, this)
      }

      this.setState('idle')
      this.destroyed = true
      
      this.log('info', 'Player destroyed successfully')

    } catch (error) {
      this.log('error', 'Error during destroy:', error)
    }
  }

  // ================================
  // 私有方法
  // ================================

  /**
   * 设置播放器状态
   * 
   * @private
   */
  private setState(newState: PlayerState): void {
    if (this.state !== newState) {
      const oldState = this.state
      this.state = newState
      this.emit('statechange', newState)
      this.log('debug', `State changed: ${oldState} -> ${newState}`)
    }
  }

  /**
   * 触发事件
   * 
   * @private
   */
  private emit<T extends keyof PlayerEvents>(event: T, ...args: PlayerEvents[T]): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach(listener => {
        try {
          ;(listener as any)(...args)
        } catch (error) {
          this.log('error', `Error in event listener for ${String(event)}:`, error)
        }
      })
    }
  }

  /**
   * 绑定配置中的事件回调
   * 
   * @private
   */
  private bindConfigCallbacks(): void {
    this.on('ready', this.config.onReady)
    this.on('play', this.config.onPlay)
    this.on('pause', this.config.onPause)
    this.on('stop', this.config.onStop)
    this.on('ended', this.config.onEnded)
    this.on('error', this.config.onError)
    this.on('volumechange', this.config.onVolumeChange)
    this.on('timeupdate', this.config.onTimeUpdate)
  }

  /**
   * 设置音频实例事件监听
   * 
   * @private
   */
  private setupSoundInstanceEvents(): void {
    if (!this.soundInstance) return

    try {
      // 播放完成事件
      this.soundInstance.on('complete', () => {
        if (!this.config.loop) {
          this.setState('stopped')
          this.emit('ended')
          this.log('info', 'Audio playback completed')
        }
      }, this)

    } catch (error) {
      this.log('error', 'Failed to setup sound instance events:', error)
    }
  }

  /**
   * 检测环境信息
   * 
   * @private
   */
  private detectEnvironment(): EnvironmentInfo {
    const userAgent = navigator.userAgent.toLowerCase()
    const isWeixin = /micromessenger/i.test(userAgent)
    const isIOS = /iphone|ipad|ipod/i.test(userAgent)
    const isAndroid = /android/i.test(userAgent)
    const isHTTPS = location.protocol === 'https:'

    let browserType: EnvironmentInfo['browserType'] = 'other'
    if (isWeixin) browserType = 'weixin'
    else if (/safari/i.test(userAgent) && !/(chrome|chromium|edge)/i.test(userAgent)) browserType = 'safari'
    else if (/chrome|chromium/i.test(userAgent)) browserType = 'chrome'
    else if (/firefox/i.test(userAgent)) browserType = 'firefox'

    // 检测微信版本
    let weixinVersion: string | undefined
    if (isWeixin) {
      const match = userAgent.match(/micromessenger\/(\d+\.\d+\.\d+)/)
      weixinVersion = match ? match[1] : undefined
    }

    return {
      isWeixin,
      isIOS,
      isAndroid,
      isHTTPS,
      userAgent,
      weixinVersion,
      supportsAutoplay: isWeixin, // 微信环境支持自动播放
      browserType
    }
  }

  /**
   * 初始化微信JSSDK
   * 
   * @private
   */
  private async initWeixinJSSDK(): Promise<void> {
    if (!this.config.weixinConfig.jssdkConfig) {
      this.log('info', 'JSSDK config not provided, skipping JSSDK initialization')
      return
    }

    return new Promise<void>((resolve) => {
      try {
        // 检查是否已加载微信JSSDK
        if (typeof window.wx !== 'undefined') {
          this.log('info', 'WeChat JSSDK already loaded')
          resolve()
          return
        }

        // 动态加载微信JSSDK
        const script = document.createElement('script')
        script.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js'
        script.async = true

        script.onload = () => {
          this.log('info', 'WeChat JSSDK loaded successfully')
          
          const jssdkConfig = this.config.weixinConfig.jssdkConfig!
          window.wx!.config({
            debug: jssdkConfig.debug || false,
            appId: jssdkConfig.appId,
            timestamp: jssdkConfig.timestamp,
            nonceStr: jssdkConfig.nonceStr,
            signature: jssdkConfig.signature,
            jsApiList: jssdkConfig.jsApiList || []
          })

          window.wx!.ready(() => {
            this.log('info', 'WeChat JSSDK configured successfully')
            resolve()
          })

          window.wx!.error((err: any) => {
            this.log('error', 'WeChat JSSDK configuration failed:', err)
            resolve() // 不阻塞播放器初始化
          })
        }

        script.onerror = () => {
          this.log('warn', 'Failed to load WeChat JSSDK, continuing without it')
          resolve() // 不阻塞播放器初始化
        }

        document.head.appendChild(script)

      } catch (error) {
        this.log('error', 'Error initializing WeChat JSSDK:', error)
        resolve() // 不阻塞播放器初始化
      }
    })
  }

  /**
   * 错误处理
   * 
   * @private
   */
  private handleError(error: Error): void {
    this.setState('error')
    this.emit('error', error)
    this.log('error', 'Player error:', error)
  }

  /**
   * 日志输出
   * 
   * @private
   */
  private log(level: 'debug' | 'info' | 'warn' | 'error', message: string, ...args: any[]): void {
    if (!this.config.debug && level === 'debug') return

    const prefix = `[WechatAudioPlayer:${this.audioId}]`
    
    switch (level) {
      case 'debug':
        console.debug(prefix, message, ...args)
        break
      case 'info':
        console.info(prefix, message, ...args)
        break
      case 'warn':
        console.warn(prefix, message, ...args)
        break
      case 'error':
        console.error(prefix, message, ...args)
        break
    }
  }
}