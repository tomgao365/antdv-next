import type { Ref } from 'vue'
import { computed } from 'vue'

export interface MaskConfig {
  enabled?: boolean
  blur?: boolean
}
export type MaskType = MaskConfig | boolean

function normalizeMaskConfig(mask?: MaskType): MaskConfig {
  if (mask && typeof mask === 'object') {
    return mask
  }
  if (typeof mask === 'boolean') {
    return {
      enabled: mask,
      blur: mask,
    }
  }
  return {}
}

export function useMergedMask(
  mask: Ref<MaskType | undefined>,
  contextMask: Ref<MaskType | undefined>,
  prefixCls: Ref<string | undefined>,
) {
  const context = computed(() => {
    const maskConfig = normalizeMaskConfig(mask.value)
    const contextMaskConfig = normalizeMaskConfig(contextMask.value)
    const mergedConfig: MaskConfig = { ...contextMaskConfig, ...maskConfig }
    const className = mergedConfig.blur !== false ? `${prefixCls.value}-mask-blur` : undefined
    return {
      enabled: mergedConfig.enabled !== false,
      classNames: { mask: className },
    }
  })

  return [
    computed(() => context.value.enabled),
    computed(() => context.value.classNames),
  ] as const
}
