/**
 * SoundJS集成模块
 * 
 * @description 将SoundJS库直接打包到项目中，实现零外部CDN依赖
 * @author Claude
 * @since 2.0.0
 */

// 导入SoundJS作为npm依赖 - 使用具体路径解决包配置问题
import 'soundjs/lib/soundjs.min.js'

/**
 * SoundJS集成类
 * 
 * @description 负责初始化内联的SoundJS库，无需外部CDN依赖
 */
export class SoundJSBundle {
  /** 是否已初始化 */
  private static initialized = false
  
  /**
   * 检查SoundJS是否已初始化
   */
  public static isInitialized(): boolean {
    return this.initialized && typeof window.createjs?.Sound !== 'undefined'
  }

  /**
   * 初始化SoundJS
   * 
   * @description SoundJS已作为npm依赖导入，直接验证和配置即可
   */
  public static initialize(): void {
    if (this.initialized) {
      return
    }

    try {
      // 验证SoundJS是否已加载
      if (typeof window.createjs?.Sound === 'undefined') {
        throw new Error('SoundJS not available: please ensure it is properly imported')
      }

      this.initialized = true
      
      // 配置SoundJS默认设置
      this.configureSoundJS()

    } catch (error) {
      throw new Error(`Failed to initialize SoundJS: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * 配置SoundJS默认设置
   * 
   * @private
   */
  private static configureSoundJS(): void {
    if (!window.createjs?.Sound) return

    try {
      // 设置支持的音频格式扩展名
      window.createjs.Sound.alternateExtensions = ['mp3', 'ogg', 'wav', 'm4a']

      // 设置默认音量
      window.createjs.Sound.setVolume(0.8)

    } catch (error) {
      console.warn('Failed to configure SoundJS:', error)
    }
  }

  /**
   * 获取SoundJS版本信息
   */
  public static getVersion(): string {
    if (!this.isInitialized()) {
      return 'not-initialized'
    }
    
    try {
      return (window.createjs as any)?.version || '1.0.0'
    } catch {
      return '1.0.0'
    }
  }

  /**
   * 重置初始化状态（用于测试）
   * 
   * @internal
   */
  public static reset(): void {
    this.initialized = false
  }
}