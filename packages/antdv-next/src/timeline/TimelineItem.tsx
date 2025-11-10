import type { Key, LiteralUnion } from '@v-c/util/dist/type'
import type { CSSProperties } from 'vue'
import type { VueNode } from '../_util/type.ts'
import { classNames } from '@v-c/util'
import { omit } from 'es-toolkit'
import { defineComponent } from 'vue'
import { getSlotPropsFnRun } from '../_util/tools.ts'
import { useBaseConfig } from '../config-provider/context.ts'

type Color = 'blue' | 'red' | 'green' | 'gray'

export interface TimelineItemProps {
  key?: Key
  prefixCls?: string
  class?: string
  color?: LiteralUnion<Color>
  dot?: VueNode
  pending?: boolean
  position?: string
  style?: CSSProperties
  label?: VueNode
  children?: VueNode
}

export type TimelineItemPropsKey = Omit<TimelineItemProps, 'key'> & { _key?: Key }

const defaults = {
  color: 'blue',
  pending: false,
} as any
const TimelineItem = defineComponent<TimelineItemPropsKey>(
  (props = defaults, { slots, attrs }) => {
    const { prefixCls } = useBaseConfig('timeline', props)
    return () => {
      const {
        pending,
        color,
      } = props
      const itemClassName = classNames(
        `${prefixCls.value}-item`,
        {
          [`${prefixCls.value}-item-pending`]: pending,
        },
        props.class,
      )
      const dot = getSlotPropsFnRun(slots, props, 'dot')
      const customColor = /blue|red|green|gray/.test(color || '') ? undefined : color
      const dotClassName = classNames(`${prefixCls.value}-item-head`, {
        [`${prefixCls.value}-item-head-custom`]: !!dot,
        [`${prefixCls.value}-item-head-${color}`]: !customColor,
      })

      const label = getSlotPropsFnRun(slots, props, 'label')
      const children = getSlotPropsFnRun({}, props, 'children')
      return (
        <li {...omit(attrs, ['styles'])} style={props.style} class={itemClassName}>
          {!!label && <div class={`${prefixCls.value}-item-label`}>{label}</div>}
          <div class={`${prefixCls.value}-item-tail`} />
          <div class={dotClassName} style={{ borderColor: customColor, color: customColor }}>
            {dot}
          </div>
          <div class={`${prefixCls.value}-item-content`}>{children}</div>
        </li>
      )
    }
  },
)

export default TimelineItem
