/**
 * Vite构建配置
 * 
 * @description 企业级生产构建配置，支持多种输出格式
 * @author Claude
 * @since 2.0.0
 */

import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    // 生成TypeScript声明文件
    dts({
      outputDir: 'dist/types',
      insertTypesEntry: true,
      copyDtsFiles: true,
      exclude: ['**/*.test.ts', '**/*.spec.ts', 'tests/**/*']
    })
  ],
  
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'WechatAudioPlayer',
      formats: ['es', 'umd', 'cjs'],
      fileName: (format) => {
        switch (format) {
          case 'es': return 'wechat-audio-player.esm.js'
          case 'umd': return 'wechat-audio-player.umd.js'
          case 'cjs': return 'wechat-audio-player.cjs.js'
          default: return `wechat-audio-player.${format}.js`
        }
      }
    },
    
    rollupOptions: {
      // 确保外部化不需要打包的依赖
      external: [],
      
      output: {
        // 提供全局变量名称
        globals: {
          // 这里可以添加外部依赖的全局变量映射
        },
        
        // 保持模块结构
        preserveModules: false,
        
        // 输出目录
        dir: 'dist',
        
        // 压缩代码
        compact: true,
        
        // 生成sourcemap
        sourcemap: true
      }
    },
    
    // 构建目标
    target: ['es2018', 'chrome70', 'firefox68', 'safari12'],
    
    // 压缩选项
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // 保留console，用于调试
        drop_debugger: true,
        pure_funcs: ['console.debug'] // 移除debug级别日志
      },
      mangle: {
        safari10: true
      }
    },
    
    // 生成清单
    manifest: true,
    
    // 清理输出目录
    emptyOutDir: true
  },
  
  // 开发服务器配置
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  
  // 环境变量
  define: {
    __VERSION__: JSON.stringify(process.env.npm_package_version || '2.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  }
})