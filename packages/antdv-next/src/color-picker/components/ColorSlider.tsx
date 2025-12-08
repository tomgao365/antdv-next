import type { BaseSliderProps } from '@v-c/color-picker'
import { UnstableProvider } from '@v-c/slider'
import { clsx } from '@v-c/util'
import { omit } from 'es-toolkit'
import { cloneVNode, computed, defineComponent } from 'vue'
import Slider from '../../slider'
import { useSliderInternalContextProvider } from '../../slider/Context'
import { getGradientPercentColor } from '../util'

interface DragStartInfo { rawValues: number[], draggingIndex: number, draggingValue: number }
interface DragChangeInfo { rawValues: number[], deleteIndex: number, draggingIndex: number, draggingValue: number }

export interface GradientColorSliderProps
  extends Omit<BaseSliderProps, 'value' | 'onChange' | 'onChangeComplete' | 'type' | 'color'> {
  value: number[]
  onChange?: (value: number[]) => void
  onChangeComplete: (value: number[]) => void
  range?: boolean
  className?: string
  activeIndex?: number
  onActive?: (index: number) => void
  type: BaseSliderProps['type'] | 'gradient'

  // Drag events
  onDragStart?: (info: DragStartInfo) => void
  onDragChange?: (info: DragChangeInfo) => void

  // Key event
  onKeyDelete?: (index: number) => void
  color: BaseSliderProps['color'] | null
}

export const GradientColorSlider = defineComponent<
  GradientColorSliderProps
>(
  (props) => {
    const linearCss = computed(() => {
      const colorsStr = props.colors.map(c => `${c.color} ${c.percent}%`).join(', ')
      return `linear-gradient(90deg, ${colorsStr})`
    })

    const pointColor = computed(() => {
      if (!props.color || !props.type) {
        return null
      }
      if (props.type === 'alpha') {
        return props.color.toRgbString()
      }
      if (props.type === 'gradient') {
        return null
      }
      return `hsl(${props.color.toHsb().h}, 100%, 50%)`
    })

    const handleRender = ({ node, index, value }: any) => {
      const nodeProps = node?.props || {}
      const mergedStyle = { ...nodeProps.style }

      if (props.type === 'gradient') {
        mergedStyle.background = getGradientPercentColor(props.colors, value)
      }

      const mergedNode = cloneVNode(node, {
        ...nodeProps,
        style: mergedStyle,
        class: clsx(nodeProps.class, {
          [`${props.prefixCls}-slider-handle-active`]: props.activeIndex === index,
        }),
        onFocus: (e: FocusEvent) => {
          props.onActive?.(index)
          nodeProps.onFocus?.(e)
        },
        onKeydown: (e: KeyboardEvent) => {
          if ((e.key === 'Delete' || e.key === 'Backspace') && props.onKeyDelete) {
            props.onKeyDelete(index)
          }
          nodeProps.onKeydown?.(e)
        },
      })

      return mergedNode
    }

    useSliderInternalContextProvider({
      handleRender,
    })

    return () => {
      const {
        prefixCls,
        range = false,
        className,
        onDragStart,
        onDragChange,
        value,
        onChange,
        onChangeComplete,
        ...restProps
      } = props
      const {
        activeIndex: _activeIndex,
        onActive: _onActive,
        onKeyDelete: _onKeyDelete,
        colors: _colors,
        color: _color,
        type: _type,
        ...sliderRestProps
      } = restProps
      return (
        <UnstableProvider value={{ onDragStart, onDragChange }}>
          <Slider
            {...sliderRestProps as any}
            class={clsx(className, `${prefixCls}-slider`)}
            tooltip={{ open: false }}
            range={range ? { editable: true, minCount: 2 } : false}
            track={false}
            styles={{
              rail: {
                background: linearCss.value,
              },
              handle: pointColor.value
                ? {
                    background: pointColor.value,
                  }
                : {},
            }}
            classes={{
              rail: `${prefixCls}-slider-rail`,
              handle: `${prefixCls}-slider-handle`,
            }}
            value={value}
            onChange={(v: number | number[]) => onChange?.(Array.isArray(v) ? v : [v])}
            onChangeComplete={(v: number | number[]) => onChangeComplete(Array.isArray(v) ? v : [v])}
          />
        </UnstableProvider>
      )
    }
  },
  {
    name: 'GradientColorSlider',
    inheritAttrs: false,
  },
)

const SingleColorSlider = defineComponent<BaseSliderProps>(
  (props) => {
    const onChange = (v: number[]) => props.onChange?.(v[0]!)
    const onChangeComplete = (v: number[]) => props.onChangeComplete?.(v[0]!)

    return () => {
      const {
        value,
        ...restProps
      } = props
      return (
        <GradientColorSlider
          {...omit(restProps, ['onChange', 'onChangeComplete']) as any}
          value={[value]}
          onChange={onChange}
          onChangeComplete={onChangeComplete}
        />
      )
    }
  },
  {
    name: 'ColorSlider',
    inheritAttrs: false,
  },
)

export default SingleColorSlider
