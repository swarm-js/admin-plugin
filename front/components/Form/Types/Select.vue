<template>
  <el-select
    :multiple="conf.multiple"
    :filterable="conf.filterable ?? false"
    style="width: 100%"
    v-model="data"
  >
    <el-option
      v-for="item in conf.options ?? []"
      :value="item.value"
      :label="item.label"
    />
  </el-select>
</template>

<script setup>
const props = defineProps({
  modelValue: {},
  conf: {}
})
const emit = defineEmits(['update:modelValue'])

const data = ref(props.modelValue ?? (props.conf.multiple ? [] : null))
watch(
  () => props.modelValue,
  _ => {
    if (JSON.stringify(props.modelValue) !== JSON.stringify(data.value))
      data.value = JSON.parse(JSON.stringify(props.modelValue))
  }
)

watch(data, async _ => {
  emit('update:modelValue', data.value)
})
</script>
