import type { App, Plugin } from 'vue'
import * as components from './components'

export * from './components'
let prefix = 'A'

export default {
  setPrefix(newPrefix: string) {
    prefix = newPrefix
  },
  install(app: App) {
    app.config.globalProperties._ant_prefix = prefix
    Object.keys(components).forEach((key) => {
      const component = (components as any)[key]
      if ('install' in component) {
        app.use(component)
      }
    })
  },
} as Plugin

export { useBreakpoint } from './grid'
