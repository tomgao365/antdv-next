import type { InjectionKey, Ref } from 'vue'
// Used for Dropdown only
import type { VueNode } from '../_util/type'
import type { MenuProps } from './menu'
import { computed, defineComponent, inject, provide } from 'vue'
import { ContextIsolator } from '../_util/ContextIsolator'

export interface OverrideContextProps {
  prefixCls?: string
  expandIcon?: VueNode
  mode?: MenuProps['mode']
  selectable?: boolean
  validator?: (menuProps: Pick<MenuProps, 'mode'>) => void
  onClick?: () => void
  rootClass?: string
}

const OverrideContextKey: InjectionKey<Ref<OverrideContextProps> | null> = Symbol('OverrideContext')

export function useOverrideContext() {
  return inject(OverrideContextKey, null)
}
/** @internal Only used for Dropdown component. Do not use this in your production. */
export const OverrideProvider = defineComponent(
  (props, { slots }) => {
    const override = useOverrideContext()
    const value = computed(() => {
      const _override = override?.value ?? {}
      return {
        ..._override,
        ...props,
      }
    })
    provide(OverrideContextKey, value)
    return () => {
      return (
        <ContextIsolator space>
          {slots?.default?.()}
        </ContextIsolator>
      )
    }
  },
)
