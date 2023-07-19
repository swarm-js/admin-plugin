<template>
  <el-date-picker
    v-model="data"
    type="date"
    format="DD/MM/YYYY"
    placeholder="Pick a day"
    style="width: 100%"
  />
</template>

<script setup>
import { dayjs } from 'element-plus'

const props = defineProps({
  modelValue: {},
  conf: {}
})
const emit = defineEmits(['update:modelValue'])

const data = ref(dayjs(props.modelValue ?? new Date()).toDate())
watch(
  () => props.modelValue,
  _ => {
    if (props.modelValue !== data.value)
      data.value = dayjs(props.modelValue).toDate()
  }
)

watch(data, async _ => {
  emit('update:modelValue', dayjs(data.value).format('YYYY-MM-DD'))
})
</script>
