import type { ScreenMap } from '../../_util/responsiveObserver'
import { onMounted, onUnmounted, ref } from 'vue'
import useResponsiveObserver from '../../_util/responsiveObserver'

export function useBreakpoint(
  refreshOnChange = true,
  defaultScreens: ScreenMap | null = {} as ScreenMap,
) {
  const screensRef = ref<ScreenMap | null>(defaultScreens)
  const responsiveObserver = useResponsiveObserver()
  let token: number
  onMounted(() => {
    token = responsiveObserver.value?.subscribe(
      (supportScreens) => {
        screensRef.value = supportScreens
        if (refreshOnChange) {
          // TODO: trigger component update
        }
      },
    )
  })
  onUnmounted(() => {
    responsiveObserver.value.unsubscribe(token)
  })
  return screensRef
}

export default useBreakpoint
