<template>
  <el-input
    type="number"
    style="width: 100%"
    v-model.number="data"
    :placeholder="conf.placeholder ?? ''"
  />
</template>

<script setup>
const props = defineProps({
  modelValue: {},
  conf: {}
})
const emit = defineEmits(['update:modelValue'])

const data = ref(props.modelValue ?? 0)
watch(
  () => props.modelValue,
  _ => {
    if (props.modelValue !== data.value) data.value = props.modelValue
  }
)

watch(data, async _ => {
  emit('update:modelValue', data.value)
})
</script>
