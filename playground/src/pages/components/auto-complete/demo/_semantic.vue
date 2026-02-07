<script setup lang="ts">
import { computed, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    'root': '根元素，包含相对定位、行内 flex 布局、光标样式、过渡动画、边框等选择器容器的基础样式',
    'prefix': '前缀元素，包含前缀内容的布局和样式',
    'input': '输入框元素，包含搜索输入框的样式、光标控制、字体继承等搜索相关样式，去除了边框样式',
    'placeholder': '占位符元素，包含占位符文本的字体样式和颜色',
    'content': '多选容器，包含已选项的布局、间距、换行相关样式',
    'clear': '清除按钮元素，包含清除按钮的布局、样式和交互效果',
    'popup.root': '弹出菜单元素，包含弹出层的定位、层级、背景、边框、阴影等弹出容器样式',
    'popup.list': '弹出菜单列表元素，包含选项列表的布局、滚动、最大高度等列表容器样式',
    'popup.listItem': '弹出菜单条目元素，包含选项项的内边距、悬浮效果、选中状态、禁用状态等选项交互样式',
  },
  en: {
    'root': 'Root element with relative positioning, inline-flex layout, cursor styles, transitions, border and other basic selector container styles',
    'prefix': 'Prefix element with layout and styling for prefix content',
    'input': 'Input element with search input styling, cursor control, font inheritance and other search-related styles. Remove border styles',
    'placeholder': 'Placeholder element with font styles and colors for placeholder text',
    'content': 'Multiple selection container with layout, spacing, and wrapping styles for selected items',
    'clear': 'Clear button element with layout, styling and interactive effects for clear button',
    'popup.root': 'Popup element with popup layer positioning, z-index, background, border, box-shadow and other popup container styles',
    'popup.list': 'Popup list element with option list layout, scrolling, max-height and other list container styles',
    'popup.listItem': 'Popup item element with option item padding, hover effects, selected states, disabled states and other option interactive styles',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root },
  { name: 'prefix', desc: locale.value.prefix },
  { name: 'input', desc: locale.value.input },
  { name: 'placeholder', desc: locale.value.placeholder },
  { name: 'content', desc: locale.value.content },
  { name: 'clear', desc: locale.value.clear },
  { name: 'popup.root', desc: locale.value['popup.root'] },
  { name: 'popup.list', desc: locale.value['popup.list'] },
  { name: 'popup.listItem', desc: locale.value['popup.listItem'] },
])

const options = ref([
  { value: 'aojunhao123', label: 'aojunhao123' },
  { value: 'thinkasany', label: 'thinkasany' },
  { value: 'meet-student', label: 'meet-student' },
])

const divRef = ref<HTMLDivElement | null>(null)
</script>

<template>
  <SemanticPreview
    component-name="AutoComplete"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div ref="divRef" :style="{ position: 'absolute', height: '200px' }">
        <a-auto-complete
          prefix="prefix"
          :style="{ width: '200px' }"
          :options="options"
          placeholder="input here"
          open
          :get-popup-container="() => divRef!"
          :classes="classes"
        />
      </div>
    </template>
  </SemanticPreview>
</template>
