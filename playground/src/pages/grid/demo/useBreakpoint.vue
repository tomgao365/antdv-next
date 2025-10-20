<script setup lang="ts">
import { useBreakpoint } from 'antdv-next'
import { computed } from 'vue'

const screens = useBreakpoint()
const screenKeys = computed(() => Object.entries(screens.value ?? {}).filter(screen => !!screen[1]))
</script>

<template>
  Current break point:
  <div class="gap-2 inline-flex">
    <template v-for="item in screenKeys" :key="item[0]">
      <span>{{ item[0] }} </span>
    </template>
  </div>
</template>

<style scoped>

</style>
