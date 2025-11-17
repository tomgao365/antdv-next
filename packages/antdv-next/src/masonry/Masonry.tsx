import type { CSSProperties, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { Breakpoint } from '../_util/responsiveObserver'
import type { ComponentBaseProps } from '../config-provider/context'
import type { RowProps } from '../grid'
import type { ItemHeightData } from './hooks/usePositions'
import type { MasonryItemType } from './MasonryItem'
import ResizeObserver from '@v-c/resize-observer'
import { clsx } from '@v-c/util'
import isEqual from '@v-c/util/dist/isEqual'
import { getTransitionGroupProps } from '@v-c/util/dist/utils/transition'
import { computed, defineComponent, nextTick, ref, shallowRef, TransitionGroup, watch } from 'vue'
import { getAttrStyleAndClass, useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import { responsiveArray } from '../_util/responsiveObserver'
import { toPropsRefs } from '../_util/tools'
import { useComponentBaseConfig } from '../config-provider/context'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import useBreakpoint from '../grid/hooks/useBreakpoint'
import useGutter from '../grid/hooks/useGutter'
import useDelay from './hooks/useDelay'
import usePositions from './hooks/usePositions'
import useRefs from './hooks/useRefs'
import MasonryItem from './MasonryItem'
import useStyle from './style'

export type Gap = number | undefined
export type Key = string | number

export type SemanticName = 'root' | 'item'

export type MasonryClassNamesType = SemanticClassNamesType<MasonryProps, SemanticName>
export type MasonryStylesType = SemanticStylesType<MasonryProps, SemanticName>

export interface MasonryProps extends ComponentBaseProps {
  classes?: MasonryClassNamesType
  styles?: MasonryStylesType
  /** Spacing between items */
  gutter?: RowProps['gutter']

  // Data
  items?: MasonryItemType[]

  itemRender?: (itemInfo: MasonryItemType & { index: number }) => any

  /** Number of columns in the masonry grid layout */
  columns?: number | Partial<Record<Breakpoint, number>>

  /** Trigger when item layout order changed */
  // onLayoutChange?: (sortInfo: { key: React.Key; column: number }[]) => void;

  fresh?: boolean

}

export interface MasonryEmits {
  layoutChange: (sortInfo: { key: Key, column: number }[]) => void
  [key: string]: (...args: any[]) => void
}

export interface MasonrySlots {
  default: () => any
}

export interface MasonryRef {
  nativeElement: HTMLDivElement
}

type ItemColumnsType = [item: MasonryItemType, column: number]

const defaults = {
  gutter: 0,
} as any
const Masonry = defineComponent<
  MasonryProps,
  MasonryEmits,
  string,
  SlotsType<MasonrySlots>
>(
  (props = defaults, { expose, emit, attrs }) => {
    const {
      direction,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
      prefixCls,
    } = useComponentBaseConfig('masonry', props)
    const { classes, styles, gutter, columns } = toPropsRefs(props, 'classes', 'styles', 'gutter', 'columns')

    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)
    // ======================= Refs =======================
    const containerRef = shallowRef<HTMLDivElement>()
    expose({
      nativeElement: containerRef,
    })

    const [setItemRef, getItemRef] = useRefs()

    // ======================= Item =======================
    const mergedItems = shallowRef<MasonryItemType[]>([])
    watch(
      () => props.items,
      () => {
        mergedItems.value = props?.items ?? []
      },
      {
        immediate: true,
      },
    )

    // ==================== Breakpoint ====================
    const screens = useBreakpoint()
    const gutters = useGutter(gutter, screens)
    const horizontalGutter = computed(() => gutters.value[0] || 0)
    const verticalGutter = computed(() => gutters.value[1] || horizontalGutter.value)

    // ====================== Layout ======================
    const columnCount = computed(() => {
      if (!columns.value) {
        return 3
      }
      if (typeof columns.value === 'number') {
        return columns.value
      }
      // Find first matching responsive breakpoint
      const matchingBreakpoint = responsiveArray.find(
        breakpoint => screens.value![breakpoint] && (columns.value as any)?.[breakpoint] !== undefined,
      )

      if (matchingBreakpoint) {
        return columns.value[matchingBreakpoint] as number
      }
      return columns.value.xs ?? 1
    })

    // =========== Merged Props for Semantic ==========
    const mergedProps = computed(() => {
      return {
        ...props,
        columns: columnCount.value,
      } as MasonryProps
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      MasonryClassNamesType,
      MasonryStylesType,
      MasonryProps
    >(useToArr(contextClassNames, classes), useToArr(contextStyles, styles), useToProps(mergedProps))

    // ================== Items Position ==================
    const itemHeights = ref<ItemHeightData[]>([])

    const collectItemSize = useDelay(() => {
      const nextItemHeights = mergedItems.value.map((item, index) => {
        const itemKey = item?.key ?? index
        const itemEle = getItemRef(itemKey)
        const rect = itemEle?.getBoundingClientRect()
        return [itemKey, rect ? rect?.height : 0, item?.column] as const
      })
      if (!isEqual(itemHeights.value, nextItemHeights)) {
        itemHeights.value = nextItemHeights as any
      }
    })
    const [itemPositions, totalHeight] = usePositions(
      itemHeights,
      columnCount,
      verticalGutter,
    )

    const itemWithPositions = computed(() => {
      return mergedItems.value.map((item, index) => {
        const key = item.key ?? index
        return {
          item,
          itemIndex: index,
          // CSSMotion will transform key to string.
          // Let's keep the original key here.
          itemKey: key,
          key,
          position: itemPositions.value.get(key),
        } as const
      })
    })

    watch(
      [mergedItems, columnCount],
      async () => {
        await nextTick()
        collectItemSize()
      },
      {
        immediate: true,
      },
    )

    // Trigger for `onLayoutChange`
    const itemColumns = ref<ItemColumnsType[]>([])

    watch(
      itemWithPositions,
      async () => {
        await nextTick()
        if (itemWithPositions.value.every(({ position }) => position)) {
          const nextItemColumns = itemWithPositions.value.map<ItemColumnsType>(({ item, position }) => [
            item,
            position!.column,
          ])
          if (!isEqual(itemColumns.value, nextItemColumns)) {
            itemColumns.value = nextItemColumns
          }
        }
      },
      {
        immediate: true,
      },
    )

    watch(
      itemColumns,
      async () => {
        await nextTick()
        if (!props.items?.length || props.items.length !== itemColumns.value.length) {
          return
        }
        const items = itemColumns.value.map(([item, column]) => ({ ...item, column }))
        emit('layoutChange', items)
      },
      {
        immediate: true,
      },
    )

    return () => {
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
      const motionName = `${prefixCls.value}-item-fade`
      const transitionProps = getTransitionGroupProps(motionName)
      return (
        <ResizeObserver onResize={collectItemSize}>
          <div
            {...restAttrs}
            ref={containerRef}
            class={clsx(
              prefixCls.value,
              contextClassName.value,
              mergedClassNames.value?.root,
              props.rootClass,
              className,
              hashId.value,
              cssVarCls.value,
              { [`${prefixCls.value}-rtl`]: direction.value === 'rtl' },
            )}
            style={{
              height: `${totalHeight.value}px`,
              ...contextStyles.value.root,
              ...contextStyle.value,
              ...style,
            }}
            onLoad={collectItemSize}
            onError={collectItemSize}
          >
            <TransitionGroup {...transitionProps}>
              {itemWithPositions.value.map((motionInfo) => {
                const {
                  item,
                  itemKey,
                  itemIndex,
                  key,
                } = motionInfo
                const position = motionInfo.position as any
                const columnIndex = position?.column ?? 0
                const widthVar = `calc((100% + ${horizontalGutter.value}px) / ${columnCount.value})`
                const itemStyle: CSSProperties = {
                  '--item-width': widthVar,
                  'insetInlineStart': `calc(var(--item-width) * ${columnIndex})`,
                  'width': `calc(var(--item-width) - ${horizontalGutter.value}px)`,
                  'top': `${position?.top}px`,
                  'position': 'absolute',
                }

                return (
                  <MasonryItem
                    key={key}
                    ref={(ele) => {
                      const element = ele && (ele as any)?.$el ? (ele as any).$el : (ele as HTMLDivElement | null)
                      setItemRef(itemKey, element)
                    }}
                    prefixCls={prefixCls.value}
                    item={item}
                    class={clsx(mergedClassNames.value?.item, item.class)}
                    style={{
                      ...(mergedStyles.value?.item ?? {}),
                      ...(item.style ?? {}),
                      ...itemStyle,
                    }}
                    index={itemIndex}
                    itemRender={props.itemRender}
                    column={columnIndex}
                    onResize={props.fresh ? collectItemSize : null}
                  />
                )
              })}
            </TransitionGroup>
          </div>
        </ResizeObserver>
      )
    }
  },
  {
    name: 'AMasonry',
    inheritAttrs: false,
  },
)

export default Masonry
