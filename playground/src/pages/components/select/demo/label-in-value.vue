<docs lang="zh-CN">
默认情况下 `onChange` 回调只能获取到 value，如需获取选中项的 label，可使用 `labelInValue` 属性。

选中项的 label 会被包装到 value 中传递给 `onChange` 回调。
</docs>

<docs lang="en-US">
As a default behavior, the `onChange` callback can only get the `value` of the selected item. The `labelInValue` prop can be used to get the `label` property of the selected item.

The `label` of the selected item will be packed as an object for passing to the `onChange` callback.
</docs>

<script setup lang="ts">
import { shallowRef } from 'vue'

const value = shallowRef({ value: 'lucy', label: 'Lucy (101)' })

const options = [
  { value: 'jack', label: 'Jack (100)' },
  { value: 'lucy', label: 'Lucy (101)' },
]

function handleChange(val: { value: string, label: string }) {
  console.log(val) // { value: "lucy", key: "lucy", label: "Lucy (101)" }
}
</script>

<template>
  <a-select
    v-model:value="value"
    label-in-value
    style="width: 120px"
    :options="options"
    @change="handleChange"
  />
</template>
