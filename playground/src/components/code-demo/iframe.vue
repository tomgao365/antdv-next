<script setup lang="ts">
import { computed, shallowRef } from 'vue'

defineOptions({
  name: 'CodeIframe',
})
const { src, height } = defineProps<{
  src: string
  height?: string
}>()
const httpSrc = computed(() => {
  if (src.startsWith('http')) {
    return src
  }
  return `/~demos/${src}`
})
const loading = shallowRef(true)
function onLoad() {
  loading.value = false
}
</script>

<template>
  <div class="code-box-iframe">
    <iframe :src="httpSrc" border="none" class="w-full" :height="height" @load="onLoad" />
    <div v-if="loading" class="code-box-iframe-spinning">
      <a-spin spinning />
    </div>
  </div>
</template>

<style>
.code-box-iframe {
  position: relative;
  border-top: 2em solid rgba(230, 230, 230, 0.7);
  border-radius: var(--ant-border-radius-sm) var(--ant-border-radius-sm) 0 0;
  border-bottom: 1px solid rgba(5, 5, 5, 0.06);
}

.dark .code-box-iframe {
  border-top-color: rgba(60, 60, 60, 0.7);
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.code-box-iframe-spinning {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.code-box-iframe::before {
  position: absolute;
  top: -1.25em;
  inset-inline-start: 1em;
  display: block;
  width: 0.5em;
  height: 0.5em;
  background-color: #f44;
  border-radius: 50%;
  box-shadow:
    0 0 0 2px #f44,
    1.5em 0 0 2px #9b3,
    3em 0 0 2px #fb5;
  content: '';
}

.code-box-iframe::after {
  content: '';
  display: block;
  position: absolute;
  top: -1.6em;
  inset-inline-start: 5.5em;
  width: calc(100% - 6em);
  height: 1.2em;
  background-color: #fff;
  border-radius: var(--ant-border-radius-sm);
}

.dark .code-box-iframe::after {
  background-color: #1f1f1f;
}
</style>
