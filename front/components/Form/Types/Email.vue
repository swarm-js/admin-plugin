<template>
  <el-input
    type="email"
    :placeholder="conf.placeholder ?? 'john.doe@example.com'"
    style="width: 100%"
    v-model="data"
  />
</template>

<script setup>
const props = defineProps({
  modelValue: {},
  conf: {}
})
const emit = defineEmits(['update:modelValue'])

const data = ref(props.modelValue ?? '')
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
