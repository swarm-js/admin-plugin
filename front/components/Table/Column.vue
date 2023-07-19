<template>
  <div :style="{ width: `${width}px` }">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'table-column',
  props: {
    label: {
      type: String
    },
    width: {
      type: Number,
      default: 200
    }
  }
}
</script>

<style></style>
