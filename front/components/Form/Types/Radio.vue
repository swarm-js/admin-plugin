<template>
  <el-checkbox-group
    v-if="conf.multiple"
    v-model="data"
    :min="conf.min"
    :max="conf.max"
  >
    <el-checkbox v-for="item in conf.options ?? []" :label="item.value">
      {{ item.label }}
    </el-checkbox>
  </el-checkbox-group>
  <el-radio-group v-else v-model="data">
    <el-radio v-for="item in conf.options ?? []" :label="item.value">
      {{ item.label }}
    </el-radio>
  </el-radio-group>
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
