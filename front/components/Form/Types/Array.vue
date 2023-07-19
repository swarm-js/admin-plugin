<template>
  <div class="form-components-array">
    <h2 v-if="conf.title.length">{{ conf.title }}</h2>
    <div class="item" v-for="(item, idx) in data">
      <form-filler
        ref="itemRefs"
        v-model="data[idx]"
        :baseValue="baseValue"
        :conf="conf.conf"
      />
      <el-button
        class="delete"
        type="danger"
        @click="deleteItem(idx)"
        style="margin-top: 20px"
      >
        <font-awesome-icon :icon="['fas', 'trash-can']" /> {{ $t('Delete') }}
      </el-button>
      <el-divider />
    </div>
    <el-button type="primary" @click="add">
      <font-awesome-icon :icon="['fas', 'plus']" />
      {{ $t('Add') }}
    </el-button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n({ useScope: 'global' })

const props = defineProps({
  modelValue: {},
  baseValue: {
    default: null
  },
  conf: {}
})
const emit = defineEmits(['update:modelValue'])

const itemRefs = ref([])

const data = ref(
  props.modelValue ? JSON.parse(JSON.stringify(props.modelValue)) : []
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

function add () {
  data.value.push({})
}

async function deleteItem (idx) {
  await ElMessageBox.confirm(
    t('Are you sure you want to delete this item ?'),
    t('Warning'),
    {
      confirmButtonText: t('OK'),
      cancelButtonText: t('Cancel'),
      type: 'warning'
    }
  )
  data.value.splice(idx, 1)
  ElMessage.success(t('Item correctly deleted.'))
}

async function validate () {
  const promises = []
  for (let item of itemRefs.value)
    promises.push(
      new Promise(async resolve => {
        try {
          const valid = await item.validate()
          resolve(valid)
        } catch {
          resolve(false)
        }
      })
    )
  return (await Promise.all(promises)).findIndex(a => a === false) === -1
}

defineExpose({ validate })
</script>

<style lang="scss">
.form-components-array {
  width: 100%;
}
</style>
