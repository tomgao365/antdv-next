import type { CSSMotionProps } from '@v-c/util/dist/utils/transition'
import type { CSSProperties } from 'vue'
import type { VueNode } from '../_util/type.ts'
import type { NotificationConfig as CPNotificationConfig } from '../config-provider/context'
import type { NotificationConfig, NotificationPlacement } from './interface'

export function getPlacementStyle(placement: NotificationPlacement, top: number, bottom: number) {
  let style: CSSProperties

  switch (placement) {
    case 'top':
      style = {
        left: '50%',
        transform: 'translateX(-50%)',
        right: 'auto',
        top: `${top}px`,
        bottom: 'auto',
      }
      break

    case 'topLeft':
      style = {
        left: 0,
        top: `${top}px`,
        bottom: 'auto',
      }
      break

    case 'topRight':
      style = {
        right: 0,
        top: `${top}px`,
        bottom: 'auto',
      }
      break

    case 'bottom':
      style = {
        left: '50%',
        transform: 'translateX(-50%)',
        right: 'auto',
        top: 'auto',
        bottom: `${bottom}px`,
      }
      break

    case 'bottomLeft':
      style = {
        left: 0,
        top: 'auto',
        bottom: `${bottom}px`,
      }
      break

    default:
      style = {
        right: 0,
        top: 'auto',
        bottom: `${bottom}px`,
      }
      break
  }
  return style
}

export function getMotion(prefixCls: string): CSSMotionProps {
  return {
    name: `${prefixCls}-fade`,
  }
}

export function getCloseIconConfig(
  closeIcon: VueNode,
  notificationConfig?: NotificationConfig,
  notification?: CPNotificationConfig,
) {
  if (typeof closeIcon !== 'undefined') {
    return closeIcon
  }
  if (typeof notificationConfig?.closeIcon !== 'undefined') {
    return notificationConfig.closeIcon
  }
  return notification?.closeIcon
}
