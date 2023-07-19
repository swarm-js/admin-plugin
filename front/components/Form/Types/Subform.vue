<template>
  <form-filler
    ref="form"
    v-model="data"
    :baseValue="baseValue"
    :title="conf.title ?? ''"
    :conf="conf.conf"
  />
</template>

<script setup>
const props = defineProps({
  modelValue: {},
  baseValue: {
    default: null
  },
  conf: {}
})
const emit = defineEmits(['update:modelValue'])
const form = ref(null)

const data = ref(
  props.modelValue ? JSON.parse(JSON.stringify(props.modelValue)) : {}
)
emit('update:modelValue', data.value)
watch(
  _ => props.modelValue,
  _ => {
    if (JSON.stringify(props.modelValue) !== JSON.stringify(data.value))
      data.value = JSON.parse(JSON.stringify(props.modelValue))
  },
  { deep: true }
)

watch(
  data,
  async _ => {
    emit('update:modelValue', data.value)
  },
  { deep: true }
)

async function validate () {
  return await form.value.validate()
}

defineExpose({ validate })
</script>
