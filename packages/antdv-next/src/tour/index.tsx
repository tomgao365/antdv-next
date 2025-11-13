import type { TourProps as VcTourProps } from '@v-c/tour'
import type { App, SlotsType } from 'vue'
import type { TourClassNamesType, TourEmits, TourProps, TourSlots, TourStepProps, TourStylesType } from './interface'
import VcTour from '@v-c/tour'
import { clsx } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { omit } from 'es-toolkit'
import { computed, defineComponent } from 'vue'
import { pureAttrs, useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import { useZIndex } from '../_util/hooks/useZIndex'
import getPlacements from '../_util/placements'
import { toPropsRefs } from '../_util/tools'
import { ZIndexProvider } from '../_util/zindexContext'
import { useComponentBaseConfig } from '../config-provider/context'
import { useToken } from '../theme/internal'
import TourPanel from './panelRender'
import useStyle from './style'

const Tour = defineComponent<
  TourProps,
  TourEmits,
  string,
  SlotsType<TourSlots>
>(
  (props, { slots, emit, attrs }) => {
    const {
      prefixCls,
      direction,
      closeIcon: contextCloseIcon,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
    } = useComponentBaseConfig('tour', props, ['closeIcon'])
    const { classes, styles } = toPropsRefs(props, 'classes', 'styles')

    const [hashId, cssVarCls] = useStyle(prefixCls)
    const [,token] = useToken()
    const mergedSteps = computed(() => {
      return props?.steps?.map((step, index) => {
        const _cover = filterEmpty(slots?.coverRender?.({ step, index }))
        const _title = filterEmpty(slots?.titleRender?.({ step, index }))
        const _description = filterEmpty(slots?.descriptionRender?.({ step, index }))
        return {
          ...step,
          cover: step?.cover ?? (_cover.length > 0 ? _cover : undefined),
          title: step?.title ?? (_title.length > 0 ? _title : undefined),
          description: step?.description ?? (_description.length > 0 ? _description : undefined),
          class: clsx(
            step.class,
            {
              [`${prefixCls.value}-primary`]: (step.type ?? props.type) === 'primary',
            },
          ),
        }
      })
    })

    // =========== Merged Props for Semantic ===========
    const mergedProps = computed(() => {
      return {
        ...props,
        steps: mergedSteps.value,
      } as TourProps
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      TourClassNamesType,
      TourStylesType,
      TourProps
    >(useToArr(contextClassNames, classes), useToArr(contextStyles, styles), useToProps(mergedProps))

    const builtinPlacements: TourProps['builtinPlacements'] = config => getPlacements({
      arrowPointAtCenter: config?.arrowPointAtCenter ?? true,
      autoAdjustOverflow: true,
      offset: token.value.marginXXS,
      arrowWidth: token.value.sizePopupArrow,
      borderRadius: token.value.borderRadius,
    })

    // ============================ zIndex ============================
    const [zIndex, contextZIndex] = useZIndex('Tour', computed(() => props.zIndex))
    return () => {
      const {
        rootClass,
        type,
        closeIcon,
      } = props
      const mergedRootClassName = clsx(
        {
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        hashId.value,
        cssVarCls.value,
        rootClass,
        contextClassName.value,
        mergedClassNames.value?.root,
        (attrs as any).class,
      )

      const semanticStyles = {
        ...mergedStyles.value,
        mask: {
          ...mergedStyles.value?.root,
          ...mergedStyles.value?.mask,
          ...contextStyle.value,
          ...(attrs as any).style,
        },
      }
      const indicatorsRender = slots?.indicatorsRender ?? props?.indicatorsRender
      const actionsRender = slots?.actionsRender ?? props?.actionsRender

      const mergedRenderPanel: VcTourProps['renderPanel'] = (stepProps, stepCurrent) => {
        return (
          <TourPanel
            styles={semanticStyles}
            classes={mergedClassNames.value}
            type={type}
            stepProps={{
              ...stepProps,
              classes: stepProps?.classNames,
            } as any}
            current={stepCurrent}
            indicatorsRender={indicatorsRender}
            actionsRender={actionsRender}
            prevButtonProps={slots?.prevButton}
            nextButtonProps={slots?.nextButton}
          />
        )
      }
      const restProps = omit(props, [
        'prefixCls',
        'type',
        'indicatorsRender',
        'actionsRender',
        'steps',
        'closeIcon',
        'styles',
      ])
      return (
        <ZIndexProvider value={contextZIndex.value}>
          <VcTour
            {...pureAttrs(attrs)}
            {...restProps}
            styles={semanticStyles}
            classNames={mergedClassNames.value}
            closeIcon={closeIcon ?? contextCloseIcon.value}
            zIndex={zIndex.value}
            rootClassName={mergedRootClassName}
            prefixCls={prefixCls.value}
            animated
            renderPanel={mergedRenderPanel}
            builtinPlacements={builtinPlacements}
            steps={mergedSteps.value}
            onClose={(current) => {
              emit('close', current)
              emit('update:open', false)
            }}
            onChange={(current) => {
              emit('update:current', current)
              emit('change', current)
            }}
            onFinish={() => {
              emit('finish')
              emit('update:open', false)
            }}
            onPopupAlign={(el, info) => {
              emit('popupAlign', el, info)
            }}
          />
        </ZIndexProvider>
      )
    }
  },
  {
    name: 'ATour',
    inheritAttrs: false,
  },
)

;(Tour as any).install = (app: App) => {
  app.component(Tour.name, Tour)
}

export type {
  TourEmits,
  TourLocale,
  TourProps,
  TourSemanticName,
  TourSlots,
  TourStylesType,
} from './interface'
export default Tour

export type TourStepItem = TourStepProps
