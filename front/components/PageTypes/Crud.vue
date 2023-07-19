<template>
  <div>
    <table-container :data="list" v-model:checked="checked">
      <template #left="item">
        <table-column
          v-for="column in leftColumns"
          :label="column.label ?? ''"
          :width="column.width ?? 200"
        >
          {{ getProperty(item.row, column.path) }}
        </table-column>
      </template>
      <template #default="item">
        <table-column
          v-for="column in centerColumns"
          :label="column.label ?? ''"
          :width="column.width ?? 200"
        >
          {{ getProperty(item.row, column.path) }}
        </table-column>
      </template>
      <template #right="item">
        <table-column
          v-for="column in rightColumns"
          :label="column.label ?? ''"
          :width="column.width ?? 200"
        >
          {{ getProperty(item.row, column.path) }}
        </table-column>
      </template>
    </table-container>
  </div>
</template>

<script setup>
import { getProperty } from 'dot-prop'

const props = defineProps({
  conf: {}
})

useState('title').value = props.conf.name
useState('actions').value = []
useState('buttons').value = []

const leftColumns = computed(_ => {
  return (props.conf.conf.columns ?? []).filter(a => a.float === 'left')
})

const rightColumns = computed(_ => {
  return (props.conf.conf.columns ?? []).filter(a => a.float === 'right')
})

const centerColumns = computed(_ => {
  return (props.conf.conf.columns ?? []).filter(
    a => ['left', 'right'].includes(a.float) === false
  )
})

const checked = ref([])

const list = ref([
  {
    id: 'one',
    firstname: 'John',
    lastname: 'Doe',
    avatar: '',
    email: 'ffefefe'
  }
])
</script>
