import type { App as AppVue } from 'vue'
import type { ComponentBaseProps } from '../config-provider/context'
import { clsx } from '@v-c/util'
import { defineComponent } from 'vue'
import { useBaseConfig } from '../config-provider/context'
import useStyle from './style'

export interface AppProps extends ComponentBaseProps {
  component?: any
}

const App = defineComponent<AppProps>(
  (props, { slots, attrs }) => {
    const { prefixCls, direction } = useBaseConfig('app', props)
    // const [] =
    const [hashId, cssVarCls] = useStyle(prefixCls)

    return () => {
      const { rootClass } = props
      const className = (attrs as any).class
      const customClassName = clsx(
        hashId.value,
        prefixCls.value,
        className,
        rootClass,
        cssVarCls.value,
        {
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
      )
      const { component = 'div' } = props
      const Component = component as any
      return (
        <Component class={customClassName}>
          { slots?.default?.()}
        </Component>
      )
    }
  },
  {
    name: 'AApp',
    inheritAttrs: false,
  },
)

;(App as any).install = (app: AppVue) => {
  app.component(App.name, App)
}

export default App
