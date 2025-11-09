import type { SlotsType } from 'vue'
import { defineComponent, onBeforeUnmount, onMounted, shallowRef } from 'vue'
import Button, { convertLegacyProps } from '../button'
import type { ButtonProps, LegacyButtonType } from '../button'
import type { EmptyEmit } from './type'

function isThenable<T>(value?: PromiseLike<T>): value is PromiseLike<T> {
  return typeof value?.then === 'function'
}

export interface ActionButtonProps {
  type?: LegacyButtonType
  actionFn?: (...args: any[]) => any | PromiseLike<any>
  close?: (...args: any[]) => void
  autoFocus?: boolean
  prefixCls: string
  buttonProps?: ButtonProps
  emitEvent?: boolean
  quitOnNullishReturnValue?: boolean
  children?: any
  isSilent?: () => boolean
}

export interface ActionButtonSlots {
  default?: () => any
}

const ActionButton = defineComponent<
  ActionButtonProps,
  EmptyEmit,
  string,
  SlotsType<ActionButtonSlots>
>(
  (props, { slots }) => {
    const clicked = shallowRef(false)
    const loading = shallowRef<ButtonProps['loading']>(false)
    const buttonRef = shallowRef<any>()
    let autoFocusTimeout: ReturnType<typeof setTimeout> | null = null

    const focusButton = () => {
      const instance = buttonRef.value
      const element = instance?.$el ?? instance
      element?.focus?.({ preventScroll: true })
    }

    onMounted(() => {
      if (props.autoFocus) {
        autoFocusTimeout = setTimeout(() => {
          focusButton()
        })
      }
    })

    onBeforeUnmount(() => {
      if (autoFocusTimeout) {
        clearTimeout(autoFocusTimeout)
        autoFocusTimeout = null
      }
    })

    const onInternalClose = (...args: any[]) => {
      props.close?.(...args)
    }

    const handlePromiseOnOk = (returnValue?: PromiseLike<any>) => {
      if (!isThenable(returnValue)) {
        return
      }
      loading.value = true
      returnValue.then(
        (...args: any[]) => {
          loading.value = false
          clicked.value = false
          onInternalClose(...args)
        },
        (error: Error) => {
          loading.value = false
          clicked.value = false
          if (props.isSilent?.()) {
            return
          }
          return Promise.reject(error)
        },
      )
    }

    const onClick = (e: MouseEvent) => {
      if (clicked.value) {
        return
      }
      clicked.value = true

      const { actionFn } = props
      if (!actionFn) {
        onInternalClose()
        return
      }

      let returnValue: PromiseLike<any> | void
      if (props.emitEvent) {
        returnValue = actionFn(e)
        if (props.quitOnNullishReturnValue && !isThenable(returnValue)) {
          clicked.value = false
          onInternalClose(e)
          return
        }
      }
      else if (actionFn.length) {
        returnValue = actionFn(onInternalClose)
        clicked.value = false
      }
      else {
        returnValue = actionFn()
        if (!isThenable(returnValue)) {
          onInternalClose()
          return
        }
      }

      handlePromiseOnOk(returnValue)
    }

    return () => {
      const buttonAttrs = props.buttonProps ?? {}
      return (
        <Button
          {...convertLegacyProps(props.type)}
          prefixCls={props.prefixCls}
          loading={loading.value}
          ref={buttonRef}
          onClick={onClick}
          {...buttonAttrs}
        >
          {slots.default?.()}
        </Button>
      )
    }
  },
  {
    name: 'AActionButton',
    inheritAttrs: false,
  },
)

export default ActionButton
