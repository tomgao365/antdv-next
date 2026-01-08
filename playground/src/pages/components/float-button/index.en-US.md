---
category: Components
group: General
title: FloatButton
description: A button that floats at the top of the page.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*tXAoQqyr-ioAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*hSAwR7cnabwAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

<DocHeading></DocHeading>

## When To Use {#when-to-use}

- For global functionality on the site.
- Buttons that can be seen wherever you browse.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue" iframe="360">Basic</demo>
  <demo src="./demo/type.vue" iframe="360">Type</demo>
  <demo src="./demo/shape.vue" iframe="360">Shape</demo>
  <demo src="./demo/content.vue" iframe="360">Content</demo>
  <demo src="./demo/tooltip.vue" iframe="360">FloatButton with tooltip</demo>
  <demo src="./demo/group.vue" iframe="360">FloatButton Group</demo>
  <demo src="./demo/group-menu.vue" iframe="360">Menu mode</demo>
  <demo src="./demo/controlled.vue" iframe="360">Controlled mode</demo>
  <demo src="./demo/placement.vue" iframe="380">placement</demo>
  <demo src="./demo/back-top.vue" iframe="360">BackTop</demo>
  <demo src="./demo/badge.vue" iframe="360">badge</demo>
  <demo src="./demo/style-class.vue" iframe="360">Custom semantic dom styling</demo>
</demo-group>

## API

### Property {#property}

Common props ref：[Common props](/docs/vue/common-props)

#### FloatButtonGroup

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| shape | Setting button shape of children | `circle` \| `square` | `circle` | - |
| trigger | Which action can trigger menu open/close | `click` \| `hover` | - | - |
| open | Whether the menu is visible or not, use it with trigger | boolean | - | - |
| closeIcon | Customize close button icon | VueNode | `<CloseOutlined />` | - |
| placement | Customize menu animation placement | `top` \| `left` \| `right` \| `bottom` | `top` | 5.21.0 |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | Record&lt;[SemanticDOM](#semantic-dom), string&gt; \| (info: \{ props \})=&gt; Record&lt;[SemanticDOM](#semantic-dom), string&gt; | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; \| (info: \{ props \})=&gt; Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; | - | - |

#### FloatButton

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| icon | Set the icon component of button | VueNode | - | - |
| content | Text and other | VueNode | - | - |
| ~~description~~ | Please use `content` instead | VueNode | - | - |
| tooltip | The text shown in the tooltip | VueNode \| TooltipProps | - | TooltipProps: 5.25.0 |
| type | Setting button type | `default` \| `primary` | `default` | - |
| shape | Setting button shape | `circle` \| `square` | `circle` | - |
| href | The target of hyperlink | string | - | - |
| target | Specifies where to display the linked URL | string | - | - |
| htmlType | Set the original html `type` of `button`, see: [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#type) | `submit` \| `reset` \| `button` | `button` | 5.21.0 |
| badge | Attach Badge to FloatButton. `status` and other props related are not supported. | [BadgeProps](/components/badge#api) | - | 5.4.0 |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | Record&lt;[SemanticDOM](#semantic-dom), string&gt; \| (info: \{ props \})=&gt; Record&lt;[SemanticDOM](#semantic-dom), string&gt; | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; \| (info: \{ props \})=&gt; Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; | - | - |

#### FloatButton.BackTop

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| duration | Time to return to top（ms） | number | 450 | - |
| target | Specifies the scrollable area dom node | () => HTMLElement | () => window | - |
| visibilityHeight | The BackTop button will not show until the scroll height reaches this value | number | 400 | - |
| target | Specifies where to display the linked URL | '_self' \| '_blank' \| '_parent' \| '_top' \| string | - | - |
| badge | Attach Badge to FloatButton. `status` and other props related are not supported. | FloatButtonBadgeProps & \{ class?: string \} | - | 5.4.0 |
| htmlType | Set the original html `type` of `button`, see: [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#type) | ButtonHTMLType | `button` | 5.21.0 |
| ariaLabel | - | string | - | - |
| style | - | CSSProperties | - | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | FloatButtonClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | FloatButtonStylesType | - | - |

### Events {#events}

#### FloatButton

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| click | Set the handler to handle `click` event | (e: MouseEvent) =&gt; void | - |

#### FloatButtonGroup

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| update:open | Callback executed when active menu is changed, use it with trigger | (open: boolean) =&gt; void | - |
| click | Set the handler to handle `click` event (only work in Menu mode) | (e: MouseEvent) =&gt; void | 5.3.0 |

#### FloatButton.BackTop

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| click | A callback function, which can be executed when you click the button | () =&gt; void | - |

### Slots {#slots}

#### FloatButton

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| default | Button content | () =&gt; any | - |
| icon | Set the icon component of button | () =&gt; any | - |
| tooltip | The text shown in the tooltip | (props?: TooltipProps) =&gt; any | - |

#### FloatButtonGroup

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| default | Children buttons content | () =&gt; any | - |
| icon | Icon of trigger button | () =&gt; any | - |
| closeIcon | Customize close button icon | () =&gt; any | - |

## Semantic DOM

Refer to [Semantic DOM](#semantic-dom) for detailed semantic structure information.

## Design Token {#design-token}

See [Customize Theme](/docs/vue/customize-theme) to learn how to use Design Token.
