import type { UploadProps as VcUploadProps } from '@v-c/upload'
import type { SlotsType } from 'vue'
import type { UploadChangeParam, UploadEmits, UploadFile, UploadProps, UploadSlots, VcFile } from './interface'
import { computed, defineComponent, nextTick, shallowRef, watch } from 'vue'
import { toPropsRefs } from '../_util/tools.ts'
import { devUseWarning, isDev } from '../_util/warning.ts'
import { useComponentBaseConfig } from '../config-provider/context.ts'
import { useDisabledContext } from '../config-provider/DisabledContext.tsx'

export const LIST_IGNORE = `__LIST_IGNORE_${Date.now()}__`
export interface UploadRef<T = any> {
  onBatchStart: VcUploadProps['onBatchStart']
  onSuccess: (response: any, file: VcFile, xhr: any) => void
  onProgress: (e: { percent: number }, file: VcFile) => void
  onError: (error: Error, response: any, file: VcFile) => void
  fileList: UploadFile<T>[]
  upload: any | null
  /**
   * Get native element for wrapping upload
   * @since 5.17.0
   */
  nativeElement: HTMLSpanElement | null
}

const defaults = {
  showUploadList: true,
  listType: 'text',
  type: 'select',
  data: {},
  multiple: false,
  accept: '',
  hasControlInside: true,
  action: '',
  supportServerRender: true,
} as any
const InternalUpload = defineComponent<
  UploadProps,
  UploadEmits,
  string,
  SlotsType<UploadSlots>
>(
  (props = defaults, { slots, attrs, expose, emit }) => {
    const {
      prefixCls,
      customRequest: contextCustomRequest,
    } = useComponentBaseConfig('upload', props, ['customRequest'])
    const {
      disabled: customDisabled,
    } = toPropsRefs(props, 'disabled')
    // ===================== Disabled =====================
    const disabled = useDisabledContext()
    const mergedDisabled = computed(() => customDisabled.value ?? disabled.value)
    const customRequest = computed(() => props?.customRequest ?? contextCustomRequest.value)

    const internalFileList = shallowRef(props?.fileList ?? props?.defaultFileList)
    watch(
      () => props.fileList,
      () => {
        internalFileList.value = props?.fileList
      },
    )
    const mergedFileList = computed(() => internalFileList.value || [])

    const dragState = shallowRef('drop')
    const upload = shallowRef()
    const wrapRef = shallowRef<HTMLSpanElement | null>(null)

    if (isDev) {
      const warning = devUseWarning('Upload')

      warning(
        (props.fileList !== undefined) || !('value' in attrs),
        'usage',
        '`value` is not a valid prop, do you mean `fileList`?',
      )
    }

    // Control mode will auto fill file uid if not provided
    watch(
      () => props?.fileList,
      () => {
        const timestamp = Date.now();
        (props?.fileList || []).forEach((file, index) => {
          if (!file.uid && !Object.isFrozen(file)) {
            file.uid = `__AUTO__${timestamp}_${index}__`
          }
        })
      },
      {
        immediate: true,
      },
    )

    const onInternalChange = (file: UploadFile, changedFileList: UploadFile[], event?: { percent: number }) => {
      const { maxCount } = props
      let cloneList = [...changedFileList]

      let exceedMaxCount = false
      if (maxCount === 1) {
        cloneList = cloneList.slice(-1)
      }
      else if (maxCount) {
        exceedMaxCount = cloneList.length > maxCount
        cloneList = cloneList.slice(0, maxCount)
      }
      nextTick(() => {
        // internalFileList.value = cloneList
        emit('update:fileList', cloneList)
      })

      const changeInfo: UploadChangeParam<UploadFile> = {
        file: file as UploadFile,
        fileList: cloneList,
      }
      if (event) {
        changeInfo.event = event
      }
      if (
        !exceedMaxCount
        || file.status === 'removed'
        // We should ignore event if current file is exceed `maxCount`
        || cloneList.some(f => f.uid === file.uid)
      ) {
        nextTick(() => {
          emit('change', changeInfo)
        })
      }
    }

    const mergedBeforeUpload = async (file: VcFile, fileListArgs: VcFile[]) => {
      const { beforeUpload } = props
      let parsedFile: File | Blob | string = file
      if (beforeUpload) {
        const result = await beforeUpload(file, fileListArgs)

        if (result === false) {
          return false
        }

        // Hack for LIST_IGNORE, we add additional info to remove from the list
        delete (file as any)[LIST_IGNORE]
        if ((result as any) === LIST_IGNORE) {
          Object.defineProperty(file, LIST_IGNORE, {
            value: true,
            configurable: true,
          })
          return false
        }

        if (typeof result === 'object' && result) {
          parsedFile = result as File
        }
      }

      return parsedFile as VcFile
    }
    return () => {
      return null
    }
  },
  {
    name: 'AUpload',
    inheritAttrs: false,
  },
)
