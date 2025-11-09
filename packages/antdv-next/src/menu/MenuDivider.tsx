import { Divider } from '@v-c/menu'
import { clsx } from '@v-c/util'
import { defineComponent } from 'vue'
import { pureAttrs } from '../_util/hooks'
import { useBaseConfig } from '../config-provider/context.ts'

export interface MenuDividerProps {
  prefixCls?: string
  dashed?: boolean
}

const MenuDivider = defineComponent<MenuDividerProps>(
  (props, { attrs }) => {
    const { prefixCls } = useBaseConfig('menu', props)
    return () => {
      const classString = clsx({
        [`${prefixCls.value}-item-divider-dashed`]: !!props.dashed,
      }, (attrs as any).class)
      return <Divider class={classString} style={(attrs as any).style} {...pureAttrs(attrs)} />
    }
  },
  {
    name: 'AMenuDivider',
    inheritAttrs: false,
  },
)

export default MenuDivider
