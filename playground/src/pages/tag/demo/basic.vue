<script setup lang="ts">
import { CloseCircleOutlined } from '@antdv-next/icons'

function preventDefault(e: Event) {
  e.preventDefault()
  console.log('Clicked! But prevent default.')
}
</script>

<template>
  <!--  <a-tag> -->
  <!--    Tag 1 -->
  <!--  </a-tag> -->

  <!--  <a-tag> -->
  <!--    <a -->
  <!--      href="https://github.com/ant-design/ant-design/issues/1862" -->
  <!--      target="_blank" -->
  <!--      rel="noopener noreferrer" -->
  <!--    > -->
  <!--      Link -->
  <!--    </a> -->
  <!--  </a-tag> -->
  <!--  <a-tag close-icon @close="preventDefault"> -->
  <!--    Prevent Default -->
  <!--  </a-tag> -->
  <a-tag>
    <template #closeIcon>
      <CloseCircleOutlined />
    </template>
    Tag 2
  </a-tag>
<!--  <a-tag -->
<!--    :closable="{ -->
<!--      'aria-label': 'Close Button', -->
<!--    }" -->
<!--  > -->
<!--    <template #closeIcon> -->
<!--      <DeleteOutlined /> -->
<!--    </template> -->
<!--    Tag 3 -->
<!--  </a-tag> -->
</template>
