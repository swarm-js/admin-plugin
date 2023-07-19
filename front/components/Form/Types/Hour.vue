<template>
  <el-time-select
    v-model="data"
    start="00:00"
    step="00:15"
    end="23:45"
    :placeholder="conf.placeholder ?? $t('Select time')"
    style="width: 100%"
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
