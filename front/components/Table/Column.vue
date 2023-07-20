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
    sortField: {
      type: String
    },
    width: {
      type: Number,
      default: 200
    },
    sortable: {
      type: Boolean,
      default: false
    }
  }
}
</script>
