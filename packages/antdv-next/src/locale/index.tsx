import type { InjectionKey, Ref } from 'vue'
import type { TransferLocale as TransferLocaleForEmpty } from '../empty'
import type { PopconfirmLocale } from '../popconfirm/PurePanel'
import type { TourLocale } from '../tour/interface.ts'
import { computed, defineComponent, inject, provide } from 'vue'

export type LocaleContextProps = Locale & { exist?: boolean }

export interface LocaleContext {
  locale: Ref<LocaleContextProps>
}

const LocaleContextKey: InjectionKey<LocaleContext> = Symbol('LocaleContext')
export const ANT_MARK = 'internalMark'
export interface LocaleProviderProps {
  locale: Locale
  /** @internal */
  _ANT_MARK__?: string
}
export interface Locale {
  locale: string
  // Pagination?: PaginationLocale;
  // DatePicker?: DatePickerLocale;
  TimePicker?: Record<string, any>
  Calendar?: Record<string, any>
  // Table?: TableLocale;
  // Modal?: ModalLocale;
  Tour?: TourLocale
  Popconfirm?: PopconfirmLocale
  // Transfer?: TransferLocale;
  Select?: Record<string, any>
  // Upload?: UploadLocale;
  Empty?: TransferLocaleForEmpty
  global?: {
    placeholder?: string
    close?: string
  }
  Icon?: Record<string, any>
  Text?: {
    edit?: any
    copy?: any
    copied?: any
    expand?: any
    collapse?: any
  }
  Form?: {
    optional?: string
    // defaultValidateMessages: ValidateMessages;
    defaultValidateMessages: Record<string, any>
  }
  Image?: {
    preview: string
  }
  QRCode?: {
    expired?: string
    refresh?: string
    scanned?: string
  }
  ColorPicker?: {
    presetEmpty: string
    transparent: string
    singleColor: string
    gradientColor: string
  }
  [key: string]: any
}
export function useLocaleProvider(props: LocaleContext) {
  provide(LocaleContextKey, props)
}

export const LocaleProvider = defineComponent<LocaleProviderProps>(
  (props, { slots }) => {
    const locale = computed<LocaleContextProps>(() => ({ ...props.locale, exist: true }))
    useLocaleProvider({ locale })
    return () => {
      return slots?.default?.()
    }
  },
  {
    name: 'LocaleProvider',
  },
)

export function useLocaleContext() {
  return inject(LocaleContextKey, undefined)
}
