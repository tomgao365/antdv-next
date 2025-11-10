import type { MenuInfo, MenuItemProps, RenderIconInfo, SelectInfo, MenuProps as VcMenuProps } from '@v-c/menu'
import type { CSSProperties, SlotsType } from 'vue'
import type { SemanticClassNames, SemanticStyles } from '../_util/hooks'
import type { VueNode } from '../_util/type.ts'
import type { SiderContextProps } from '../layout/Sider'
import type { ItemType } from './interface.ts'
import type { MenuContextProps, MenuTheme } from './MenuContext'
import { EllipsisOutlined } from '@antdv-next/icons'
import VcMenu from '@v-c/menu'
import { clsx } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { omit } from 'es-toolkit'
import { computed, createVNode, defineComponent, isVNode, shallowRef } from 'vue'
import { useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import initCollapseMotion from '../_util/motion.ts'
import { toPropsRefs } from '../_util/tools.ts'
import { devUseWarning, isDev } from '../_util/warning.ts'
import { useComponentBaseConfig } from '../config-provider/context.ts'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls.ts'
import { MenuContextProvider } from './MenuContext'
import Divider from './MenuDivider'
import MenuItem from './MenuItem'
import { OverrideProvider, useOverrideContext } from './OverrideContext.tsx'
import useStyle from './style'
import SubMenu from './SubMenu'

const omitPropKeys = [
  'prefixCls',
  'theme',
  'expandIcon',
  '_internalDisableMenuItemTitleTooltip',
  'inlineCollapsed',
  'siderCollapsed',
  'rootClassName',
  'mode',
  'selectable',
  'onClick',
  'overflowedIndicatorPopupClassName',
  'classes',
  'styles',
  'itemIcon',
  'labelRender',
  'extraRender',
] as const
const MENU_COMPONENTS: any = {
  item: MenuItem,
  submenu: SubMenu,
  divider: Divider,
}
function isEmptyIcon(icon?: VueNode) {
  return icon === null || icon === false
}
export type SemanticName = 'root' | 'itemTitle' | 'list' | 'item' | 'itemIcon' | 'itemContent'

export type SubMenuSemanticName = 'item' | 'itemTitle' | 'list' | 'itemContent' | 'itemIcon'

type MenuClassNamesSchemaType = SemanticClassNames<SemanticName> & {
  popup?: SemanticClassNames<'root'> | string
  subMenu?: SemanticClassNames<SubMenuSemanticName>
}

type MenuStylesSchemaType = SemanticStyles<SemanticName> & {
  popup?: SemanticStyles<'root'> | CSSProperties
  subMenu?: SemanticStyles<SubMenuSemanticName>
}

export type MenuClassNamesType
  = | MenuClassNamesSchemaType
    | ((info: { props: MenuProps }) => MenuClassNamesSchemaType)

export type MenuStylesType
  = | MenuStylesSchemaType
    | ((info: { props: MenuProps }) => MenuStylesSchemaType)

export interface MenuProps extends Omit<
  VcMenuProps,
  'items'
  | '_internalComponents'
  | 'classes'
  | 'styles'
  | 'activeKey'
  | 'defaultActiveFirst'
  | 'onClick'
  | 'onDeselect'
  | 'onSelect'
  | 'onOpenChange'
  | 'rootClass'
  | 'labelRender'
  | 'extraRender'
  | 'itemIcon'
> {
  theme?: MenuTheme
  inlineIndent?: number

  // >>>>> Private
  /**
   * @private Internal Usage. Not promise crash if used in production. Connect with chenshuai2144
   *   for removing.
   */
  _internalDisableMenuItemTitleTooltip?: boolean

  items?: ItemType[]
  classes?: MenuClassNamesType
  styles?: MenuStylesType
  rootClass?: string
  labelRender?: (item: ItemType) => any
  extraRender?: (item: ItemType) => any
  itemIcon?: (props: MenuItemProps & RenderIconInfo) => any
}

type InternalMenuProps = MenuProps
  & SiderContextProps & {
    collapsedWidth?: string | number
  }

export interface MenuEmits {
  'click': (info: MenuInfo) => void
  'select': (info: SelectInfo) => void
  'deselect': (info: SelectInfo) => void
  'openChange': (openKeys: string[]) => void
  'update:openKeys': (openKeys: string[]) => void
  'update:selectedKeys': (selectedKeys: string[]) => void
  [key: string]: (...args: any[]) => void
}

export interface MenuSlots {
  default: () => any
  expandIcon: () => any
  labelRender?: (item: ItemType) => any
  extraRender?: (item: ItemType) => any
  itemIcon?: (props: MenuItemProps & RenderIconInfo) => any
}

const defaults = {
  theme: 'light',
} as any
const InternalMenu = defineComponent<
  InternalMenuProps,
  MenuEmits,
  string,
  SlotsType<MenuSlots>
>(
  (props = defaults, { slots, emit, attrs, expose }) => {
    const override = useOverrideContext()
    const overrideObj = computed(() => {
      if (!override?.value) {
        return {}
      }
      return override?.value
    })
    const { classes, styles } = toPropsRefs(props, 'classes', 'styles')
    const {
      prefixCls,
      getPrefixCls,
      direction,
      getPopupContainer,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
      expandIcon: contextExpandIcon,
    } = useComponentBaseConfig('menu', props, ['expandIcon'])
    const rootPrefixCls = computed(() => getPrefixCls())

    // ======================== Warning ==========================
    if (isDev) {
      const warning = devUseWarning('Menu')

      warning(
        !(props.inlineCollapsed && props.mode !== 'inline'),
        'usage',
        '`inlineCollapsed` should only be used when `mode` is inline.',
      )
      const children = filterEmpty(slots?.default?.())
      warning.deprecated('items' in props && !children.length, 'children', 'items')
    }
    overrideObj?.value?.validator?.({ mode: props.mode })
    // ========================== Click ==========================
    // Tell dropdown that item clicked
    const onItemClick: VcMenuProps['onClick'] = (...args) => {
      emit('click', ...args)
      overrideObj?.value?.onClick?.()
    }
    // ========================== Mode ===========================
    const mergedMode = computed(() => {
      return overrideObj?.value?.mode || props?.mode
    })

    // ======================= Selectable ========================
    const mergedSelectable = computed(() => overrideObj?.value?.selectable ?? props?.selectable)

    // ======================== Collapsed ========================
    // Inline Collapsed
    const mergedInlineCollapsed = computed(() => props?.inlineCollapsed ?? props?.siderCollapsed)

    // ================ Merged Props for Semantic ================
    const mergedProps = computed(() => {
      return {
        ...props,
        mode: mergedMode.value,
        inlineCollapsed: mergedInlineCollapsed.value,
        selectable: mergedSelectable.value,
      } as MenuProps
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      MenuClassNamesType,
      MenuStylesType,
      MenuProps
    >(
      useToArr(contextClassNames, classes),
      useToArr(contextStyles, styles),
      useToProps(mergedProps),
      computed(() => ({
        popup: {
          _default: 'root',
        },
        subMenu: {
          _default: 'item',
        },
      })),
    )

    const defaultMotions: MenuProps['defaultMotions'] = {
      horizontal: { name: `${rootPrefixCls.value}-slide-up` },
      inline: initCollapseMotion(rootPrefixCls.value),
      other: { name: `${rootPrefixCls.value}-zoom-big` },
    }

    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls, !override?.value)
    // ======================== Context ==========================
    const contextValue = computed(() => ({
      prefixCls: prefixCls.value,
      inlineCollapsed: mergedInlineCollapsed.value || false,
      direction: direction.value,
      firstLevel: true,
      theme: props.theme,
      mode: mergedMode.value,
      disableMenuItemTitleTooltip: props._internalDisableMenuItemTitleTooltip,
      classes: mergedClassNames.value as MenuContextProps['classes'],
      styles: mergedStyles.value as MenuContextProps['styles'],
    }))

    const menuRef = shallowRef<any>()
    expose({
      menu: menuRef,
    })
    return () => {
      // ====================== ExpandIcon ========================
      const expandIcon = slots?.expandIcon ?? props?.expandIcon
      const mergedExpandIcon = (props: any) => {
        if (typeof expandIcon === 'function' || isEmptyIcon(expandIcon)) {
          return expandIcon || null
        }

        if (typeof overrideObj.value?.expandIcon === 'function' || isEmptyIcon(overrideObj.value?.expandIcon)) {
          return overrideObj.value.expandIcon || null
        }

        if (typeof contextExpandIcon.value === 'function' || isEmptyIcon(contextExpandIcon.value as any)) {
          return contextExpandIcon.value || null
        }

        const mergedIcon = expandIcon ?? overrideObj?.value.expandIcon ?? contextExpandIcon.value
        const icon = typeof mergedIcon === 'function' ? (mergedIcon as any)?.(props) : mergedIcon
        const iconChild = filterEmpty(Array.isArray(icon) ? icon : [icon])[0]
        if (isVNode(iconChild)) {
          return createVNode(iconChild, {
            class: `${prefixCls.value}-submenu-expand-icon`,
          })
        }
      }
      const _getPopupContainer = props?.getPopupContainer ?? getPopupContainer
      const {
        theme,
        overflowedIndicatorPopupClassName,
        rootClass,
      } = props
      const restProps = omit(props, omitPropKeys)
      const passedProps = omit(restProps, ['collapsedWidth', 'rootClass', 'style', 'class'])
      const menuClassName = clsx(`${prefixCls.value}-${theme}`, contextClassName.value, (attrs as any).class)
      const itemIcon = slots?.itemIcon ?? props?.itemIcon
      const labelRender = slots?.labelRender ?? props?.labelRender
      const extraRender = slots?.extraRender ?? props?.extraRender

      // ========================= Render ==========================
      return (
        <OverrideProvider value={null}>
          <MenuContextProvider value={contextValue.value as any}>
            <VcMenu
              getPopupContainer={_getPopupContainer}
              overflowedIndicator={<EllipsisOutlined />}
              overflowedIndicatorPopupClassName={
                clsx(
                  prefixCls.value,
                  `${prefixCls.value}-${theme}`,
                  overflowedIndicatorPopupClassName,
                )
              }
              classes={{
                list: mergedClassNames.value?.list,
                listTitle: mergedClassNames.value?.itemTitle,
              } as any}
              styles={{
                list: mergedStyles.value?.list,
                listTitle: mergedStyles.value?.itemTitle,
              } as any}
              mode={mergedMode.value}
              selectable={mergedSelectable.value}
              {...passedProps}
              inlineCollapsed={mergedInlineCollapsed.value as any}
              style={{
                ...mergedStyles.value?.root,
                ...contextStyle.value,
                ...(attrs as any).style,
              }}
              ref={menuRef as any}
              class={menuClassName}
              prefixCls={prefixCls.value}
              direction={direction.value}
              defaultMotions={defaultMotions}
              expandIcon={mergedExpandIcon}
              rootClass={clsx(
                rootClass,
                hashId.value,
                overrideObj?.value?.rootClass,
                cssVarCls.value,
                rootCls.value,
                mergedClassNames.value?.root,
              )}
              onClick={onItemClick}
              onDeselect={(info) => {
                emit('deselect', info)
                emit('update:selectedKeys', info.selectedKeys)
              }}
              onSelect={(info) => {
                emit('select', info)
                emit('update:selectedKeys', info.selectedKeys)
              }}
              onOpenChange={(...args) => {
                emit('openChange', ...args)
                emit('update:openKeys', ...args)
              }}
              itemIcon={itemIcon}
              labelRender={labelRender as any}
              extraRender={extraRender as any}
              _internalComponents={MENU_COMPONENTS}
            />
          </MenuContextProvider>
        </OverrideProvider>
      )
    }
  },
  {
    name: 'InternalMenu',
    inheritAttrs: false,
  },
)

export default InternalMenu
