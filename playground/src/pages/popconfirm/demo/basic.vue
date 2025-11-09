<script lang="ts" setup>
import { shallowRef } from 'vue'

function handleConfirm() {
  console.log('Confirmed')
}
function handleCancel() {
  console.log('Cancelled')
}
const open = shallowRef(false)
</script>

<template>
  <a-popconfirm
    v-model:open="open"
    title="Delete the task"
    description="Are you sure to delete this task?"
    ok-text="Yes"
    cancel-text="No"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <a-button danger>
      Delete
    </a-button>
  </a-popconfirm>
</template>
