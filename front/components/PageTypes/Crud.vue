<template>
  <div class="crud-type">
    <form-modal ref="modal" />
    <table-container
      :data="list"
      v-model:checked="checked"
      v-model:sort="sort"
      :loading="loading"
    >
      <template #left="item">
        <table-column
          v-for="column in leftColumns"
          :label="column.label ?? ''"
          :sortable="column.sortable ?? false"
          :sortField="column.sortField ?? column.path"
          :width="column.width ?? 200"
        >
          <component
            :is="getColumnContent(item.row, column)"
            :row="item.row"
          ></component>
        </table-column>
      </template>
      <template #default="item">
        <table-column
          v-for="column in centerColumns"
          :label="column.label ?? ''"
          :sortable="column.sortable ?? false"
          :sortField="column.sortField ?? column.path"
          :width="column.width ?? 200"
        >
          <component
            :is="getColumnContent(item.row, column)"
            :row="item.row"
          ></component>
        </table-column>
      </template>
      <template #right="item">
        <table-column
          v-for="column in rightColumns"
          :label="column.label ?? ''"
          :sortable="column.sortable ?? false"
          :sortField="column.sortField ?? column.path"
          :width="column.width ?? 200"
        >
          <component
            :is="getColumnContent(item.row, column)"
            :row="item.row"
          ></component>
        </table-column>
        <table-column
          v-if="props.conf.edit || props.conf.delete"
          label=""
          :width="props.conf.edit && props.conf.delete ? 77 : 22"
        >
          <el-button
            class="action-button"
            type="primary"
            plain
            @click="editItem(item.row)"
            v-if="props.conf.edit"
          >
            <font-awesome-icon :icon="['fas', 'pen']" />
          </el-button>
          <el-button
            class="action-button"
            type="danger"
            plain
            @click="deleteItem(item.row)"
            v-if="props.conf.delete"
          >
            <font-awesome-icon :icon="['fas', 'trash']" />
          </el-button>
        </table-column>
      </template>
    </table-container>
    <el-pagination
      v-model:current-page="page"
      v-model:page-size="limit"
      :page-sizes="[5, 10, 25, 50, 100]"
      layout="total, sizes, prev, pager, next"
      :total="total"
    />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n({ useScope: 'global' })
import { getProperty } from 'dot-prop'
import qs from 'qs'

const props = defineProps({
  conf: {}
})

const conf = inject('conf')
const modal = ref(null)

useState('actions').value = []

function refreshButtons () {
  useState('buttons').value = [
    checked.value.length
      ? {
          label: t('Delete selected items'),
          type: 'danger',
          action () {
            deleteSelected()
          }
        }
      : null,
    props.conf.create
      ? {
          label: t('Add'),
          type: 'success',
          action () {
            addItem()
          }
        }
      : null
  ].filter(a => a !== null)
}

const route = useRoute()

const leftColumns = computed(_ => {
  return (props.conf.columns ?? []).filter(a => a.float === 'left')
})

const rightColumns = computed(_ => {
  return (props.conf.columns ?? []).filter(a => a.float === 'right')
})

const centerColumns = computed(_ => {
  return (props.conf.columns ?? []).filter(
    a => ['left', 'right'].includes(a.float) === false
  )
})

function getColumnContent (row, column) {
  let template = ''
  if (column.template !== undefined) template = column.template
  else if (column.path !== undefined) {
    const val = getProperty(row, column.path) ?? ''
    switch (column.formatter) {
      case 'image':
        template = `<div style="height: 32px;width: 32px;border-radius: 32px;background: transparent url(${val}) no-repeat center center; background-size: cover;"></div>`
        break
      case 'bold':
        template = `<strong>${val}</strong>`
        break
      case 'italic':
        template = `<em>${val}</em>`
        break
      case 'link':
        if ((val ?? '').length) {
          template = `<a href="${val}" target="_blank">(${t('Link')})</a>`
        } else {
          template = '-'
        }
        break
      case 'email':
        if ((val ?? '').length) {
          template = `<a href="mailto:${val}" target="_blank">${val}</a>`
        } else {
          template = '-'
        }
        break
      case 'phone':
        if ((val ?? '').length) {
          const pn = parsePhoneNumber(val, {
            regionCode: conf.defaultCountry ?? 'US'
          })
          template = `<a href="tel:${
            pn.valid ? pn.number.e164 : val
          }" target="_blank">${pn.valid ? pn.number.e164 : val}</a>`
        } else {
          template = '-'
        }
        break
      default:
        template = `${val}`
        break
    }
  }

  return defineComponent({
    template,
    props: {
      row: {}
    }
  })
}

const checked = ref([])
const sort = ref(route.query.sort ?? props.conf.sort)
const page = ref(+(route.query.page ?? 1))
const limit = ref(+(route.query.limit ?? props.conf.limit))
const total = ref(0)
const list = ref([])
const loading = ref(false)
const api = useApi()

watch(
  [checked],
  _ => {
    refreshButtons()
  },
  { deep: true, immediate: true }
)

function refreshUrl () {
  history.pushState(
    {},
    null,
    route.path +
      '?' +
      qs.stringify({
        page: page.value,
        limit: limit.value,
        sort: sort.value
      })
  )
}

let cancelController = null

async function refreshList () {
  refreshUrl()
  loading.value = true
  if (cancelController) {
    cancelController.abort()
  }
  cancelController = new AbortController()
  const ret = await api.get(
    `/admin/tab/${route.params.tabId}/crud`,
    {
      page: page.value,
      limit: limit.value,
      sort: sort.value
    },
    { signal: cancelController.signal }
  )
  list.value = ret.docs
  total.value = ret.total
  const ids = ret.docs.map(a => a.id)
  checked.value = checked.value.filter(a => ids.includes(a))
  loading.value = false
}

refreshList()

watch([page, limit, sort], _ => {
  refreshList()
})

async function addItem () {
  const data = await modal.value.fill(t('Add an item'), props.conf.fields, {})
  await api.post(`/admin/tab/${route.params.tabId}/crud`, data)
  ElMessage.success(t('Item added'))
  sort.value = props.conf.sort
  page.value = 1
  refreshList()
}

async function editItem (item) {
  const oldValues = await api.get(
    `/admin/tab/${route.params.tabId}/crud/${item.id}`
  )
  const data = await modal.value.fill(
    t('Add an item'),
    props.conf.fields,
    oldValues
  )
  await api.patch(`/admin/tab/${route.params.tabId}/crud/${item.id}`, data)
  ElMessage.success(t('Item updated'))
  refreshList()
}

async function deleteItem (item) {
  await ElMessageBox.confirm(
    t('Are you sure you want to delete this item ?'),
    t('Warning'),
    {
      confirmButtonText: t('OK'),
      cancelButtonText: t('Cancel'),
      type: 'warning'
    }
  )
  await api.delete(`/admin/tab/${route.params.tabId}/crud/${item.id}`)
  ElMessage.success(t('Item deleted'))
  refreshList()
}
async function deleteSelected () {
  await ElMessageBox.confirm(
    t('Are you sure you want to delete those items ?'),
    t('Warning'),
    {
      confirmButtonText: t('OK'),
      cancelButtonText: t('Cancel'),
      type: 'warning'
    }
  )
  for (let id of checked.value)
    await api.delete(`/admin/tab/${route.params.tabId}/crud/${id}`)
  ElMessage.success(t('Items deleted'))
  refreshList()
}
</script>

<style lang="scss">
.crud-type {
  height: 100%;
  display: flex;
  flex-direction: column;

  > .table-container {
    flex-grow: 1;
  }

  > .el-pagination {
    width: 100%;
  }
}
</style>
