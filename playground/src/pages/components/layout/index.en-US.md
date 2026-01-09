---
category: Components
group: Layout
title: Layout
description: Handling the overall layout of a page.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*4i58ToAcxaYAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*HdS6Q5vUCDcAAAAAAAAAAAAADrJ8AQ/original
---

<DocHeading></DocHeading>

## Specification

### Size

The first level navigation is left aligned near a logo, and the secondary menu is right aligned.

- Top Navigation: the height of the first level navigation is `64px`, and the second level navigation is `48px`.
- Top Navigation (for landing pages): the height of the first level navigation is `80px`, and the second level navigation is `56px`.
- Calculation formula of a top navigation: `48+8n`.
- Calculation formula of an aside navigation: `200+8n`.

### Interaction rules

- The first level navigation and the last level navigation should be distinguishable by visualization;
- The current item should have the highest priority of visualization;
- When the current navigation item is collapsed, the style of the current navigation item is applied to its parent level;
- The left side navigation bar has support for both the accordion and expanding styles; you can choose the one that fits your case the best.

## Visualization rules

Style of a navigation should conform to its level.

- **Emphasis by colorblock**

  When the background color is a deep color, you can use this pattern for the parent level navigation item of the current page.

- **The highlight match stick**

  When the background color is a light color, you can use this pattern for the current page navigation item; we recommend using it for the last item of the navigation path.

- **Highlighted font**

  From the visualization aspect, a highlighted font is stronger than colorblock; this pattern is often used for the parent level of the current item.

- **Enlarge the size of the font**

  `12px`, `14px` is a standard font size of navigation's, `14px` is used for the first and the second level of the navigation. You can choose an appropriate font size regarding the level of your navigation.

## Component Overview

- `Layout`: The layout wrapper, in which `Header` `Sider` `Content` `Footer` or `Layout` itself can be nested, and can be placed in any parent container.
- `Header`: The top layout with the default style, in which any element can be nested, and must be placed in `Layout`.
- `Sider`: The sidebar with default style and basic functions, in which any element can be nested, and must be placed in `Layout`.
- `Content`: The content layout with the default style, in which any element can be nested, and must be placed in `Layout`.
- `Footer`: The bottom layout with the default style, in which any element can be nested, and must be placed in `Layout`.

> Based on `flex layout`, please pay attention to the [compatibility](http://caniuse.com/#search=flex).

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic Structure</demo>
</demo-group>

## API

```html
<a-layout>
  <a-layout-header>header</a-layout-header>
  <a-layout>
    <a-layout-sider>left sidebar</a-layout-sider>
    <a-layout-content>main content</a-layout-content>
    <a-layout-sider>right sidebar</a-layout-sider>
  </a-layout>
  <a-layout-footer>footer</a-layout-footer>
</a-layout>
```

### Layout

Common props ref：[Common props](/docs/vue/common-props)

The wrapper.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| hasSider | Whether contain Sider in children, don't have to assign it normally. Useful in ssr avoid style flickering | boolean | - |

### Layout.Sider

#### Property {#layout-sider-property}

The sidebar.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| breakpoint | [Breakpoints](/components/grid/#col) of the responsive layout | `xs` \| `sm` \| `md` \| `lg` \| `xl` \| `xxl` | - |
| collapsed | To set the current status | boolean | - |
| collapsedWidth | Width of the collapsed sidebar, by setting to 0 a special trigger will appear | number | 80 |
| collapsible | Whether can be collapsed | boolean | false |
| reverseArrow | Reverse direction of arrow, for a sider that expands from the right | boolean | false |
| theme | Color theme of the sidebar | `light` \| `dark` | `dark` |
| trigger | Specify the customized trigger, set to null to hide the trigger | VueNode | - |
| width | Width of the sidebar | number \| string | 200 |
| zeroWidthTriggerStyle | To customize the styles of the special trigger that appears when `collapsedWidth` is 0 | object | - |

#### Events {#layout-sider-events}

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| breakpoint | The callback function, executed when [breakpoints](/components/grid/#api) changed | (broken) =\> \{\} | - |
| collapse | The callback function, executed by clicking the trigger or activating the responsive layout | (collapsed, type) =\> \{\} | - |

#### breakpoint width

```js
{
  xs: '480px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1600px',
}
```
