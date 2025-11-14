import type { InjectionKey } from 'vue'
import type { NotificationConfig, NotificationInstance } from '../notification/interface'
import { defineComponent, inject, provide } from 'vue'

export interface AppConfig {
  // message?: MessageConfig;
  notification?: NotificationConfig
}

const AppConfigContextKey: InjectionKey<UseAppProps> = Symbol('AppConfigContext')

export interface UseAppProps {
  notification: NotificationInstance
}

export const AppConfigProvider = defineComponent<UseAppProps>(
  (props, { slots }) => {
    provide(AppConfigContextKey, props)
    return () => {
      return slots?.default?.()
    }
  },
)

export function useAppConfig() {
  return inject(AppConfigContextKey, {
    notification: {},
  } as UseAppProps)
}
