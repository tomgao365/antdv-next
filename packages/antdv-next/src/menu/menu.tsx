import type { MenuProps as VcMenuProps } from '@v-c/menu'
import type { CSSProperties } from 'vue'
import type { SemanticClassNames, SemanticStyles } from '../_util/hooks'
import type { ItemType } from './interface.ts'
import type { MenuTheme } from './MenuContext.tsx'

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

export interface MenuProps extends Omit<VcMenuProps, 'items' | '_internalComponents' | 'classNames' | 'styles' | 'activeKey' | 'defaultActiveFirst'> {
  theme?: MenuTheme
  inlineIndent?: number

  // >>>>> Private
  /**
   * @private Internal Usage. Not promise crash if used in production. Connect with chenshuai2144
   *   for removing.
   */
  _internalDisableMenuItemTitleTooltip?: boolean

  items?: ItemType[]
  classNames?: MenuClassNamesType
  styles?: MenuStylesType
}
