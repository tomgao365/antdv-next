import type { Ref } from 'vue'
import { computed, shallowRef, unref } from 'vue'

export type OmitFocusType = 'focusTriggerAfterClose' | 'focusTrap' | 'autoFocusButton'

export interface FocusableConfig {
  focusTriggerAfterClose?: boolean
  trap?: boolean
}
export default function useFocusable(
  focusable: Ref<FocusableConfig | undefined> = shallowRef(),
  defaultTrap: Ref<boolean | undefined> = shallowRef(),
  legacyFocusTriggerAfterClose: Ref<FocusableConfig['focusTriggerAfterClose'] | undefined> = shallowRef(),
) {
  const ret: FocusableConfig = {
    trap: unref(defaultTrap) ?? true,
    focusTriggerAfterClose: unref(legacyFocusTriggerAfterClose) ?? true,
  }
  return computed(() => {
    return {
      ...ret,
      ...unref(focusable),
    }
  })
}
