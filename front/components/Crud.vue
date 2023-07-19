<template>
  <el-dialog
    class="crud-dialog"
    v-model="editing"
    fullscreen
    :title="dialogTitle"
    width="100%"
    :before-close="handleClose"
    destroy-on-close
  >
    <el-skeleton v-if="editingLoading" :rows="5" animated />
    <div v-else>
      <slot name="before-edit" :row="edited"></slot>
      <form-filler ref="formRef" v-model="edited" :conf="conf" />
      <slot name="after-edit" :row="edited"></slot>
    </div>
    <template #footer>
      <span class="dialog-footer" v-if="!editingLoading">
        <el-button @click="editing = false" :disabled="saving">{{
          $t('Cancel')
        }}</el-button>
        <el-button type="primary" @click="save" :disabled="saving">
          {{ $t('Save') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
  <div class="crud">
    <div class="header">
      <div class="buttons">
        <el-button type="primary" v-if="addable" @click="addItem" size="large">
          <font-awesome-icon :icon="['fas', 'plus']" />
          {{ $t('Add') }}
        </el-button>
        <slot name="header-buttons"></slot>
      </div>
      <el-row justify="end">
        <el-col :xs="24" :sm="8" v-if="searchable">
          <el-input
            size="large"
            v-model="search"
            @keyup.enter="refreshList"
            :placeholder="$t('Search ...')"
          >
            <template #prefix>
              <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
            </template>
          </el-input>
        </el-col>
      </el-row>
      <div class="sort" @click="sortOpened = !sortOpened" v-if="sorts.length">
        <font-awesome-icon :icon="['fas', 'arrow-down-wide-short']" />
      </div>
    </div>

    <el-select class="sortOpened" v-if="sortOpened" v-model="sort" size="large">
      <el-option
        v-for="option in sorts"
        :value="option.value"
        :label="option.label"
      >
      </el-option>
    </el-select>

    <div class="container">
      <div class="loading" v-if="loading">
        <el-skeleton :rows="5" animated />
      </div>
      <div class="items" v-else>
        <slot name="before-list"></slot>
        <div class="item" v-for="(item, idx) in list">
          <el-card>
            <slot :row="item" :idx="idx" />
            <el-row
              :gutter="20"
              v-if="editable || deletable"
              style="margin-top: 16px"
            >
              <el-col :xs="editable && deletable ? 12 : 24" v-if="editable">
                <el-button
                  style="width: 100%"
                  type="primary"
                  @click="editItem(item.id)"
                  >{{ $t('Edit') }}</el-button
                >
              </el-col>
              <el-col :xs="editable && deletable ? 12 : 24" v-if="deletable">
                <el-button
                  style="width: 100%"
                  type="danger"
                  @click="deleteItem(item.id)"
                  >{{ $t('Delete') }}</el-button
                >
              </el-col>
            </el-row>
          </el-card>
        </div>
        <div class="empty" v-if="list.length === 0">
          <el-empty :description="$t('Nothing to show')" />
        </div>
        <slot name="after-list"></slot>
      </div>
    </div>

    <div class="pagination" v-if="maxPage > 1">
      <el-button @click="page--" v-if="page > 1">
        <font-awesome-icon :icon="['fas', 'angles-left']" />
      </el-button>
      <div class="text">
        {{ $t('Page {page} on {maxPage}', { page, maxPage }) }}
      </div>
      <el-button @click="page++" v-if="page < maxPage">
        <font-awesome-icon :icon="['fas', 'angles-right']" />
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import qs from 'qs'
const { t } = useI18n({ useScope: 'global' })

const props = defineProps({
  endpoint: String,
  conf: {},
  addable: {
    type: Boolean,
    default: false
  },
  editable: {
    type: Boolean,
    default: false
  },
  deletable: {
    type: Boolean,
    default: false
  },
  searchable: {
    type: Boolean,
    default: false
  },
  defaultSort: {
    type: String,
    default: '-_id'
  },
  sortOptions: {
    default: null
  },
  defaultLimit: {
    type: Number,
    default: 5
  },
  getEndpoint: {
    type: String,
    default: null
  },
  updateEndpoint: {
    type: String,
    default: null
  },
  deleteEndpoint: {
    type: String,
    default: null
  },
  createEndpoint: {
    type: String,
    default: null
  }
})
const emit = defineEmits(['save'])

const api = useApi()
const route = useRoute()

const list = ref([])
const page = ref(+(route.query.page ?? 1))
const limit = ref(+(route.query.limit ?? props.defaultLimit))
const search = ref(route.query.search ?? '')
const sort = ref(route.query.sort ?? props.defaultSort)
const total = ref(0)
const maxPage = ref(1)
const loading = ref(false)
const editing = ref(false)
const editingLoading = ref(false)
const saving = ref(false)
const edited = ref({})
const dialogTitle = ref('')
const formRef = ref(null)
const sorts = props.sortOptions ?? []
const sortOpened = ref(false)
let abort = null

function buildUrl (type, id = null) {
  let url = props[`${type}Endpoint`] ?? props.endpoint
  if (id === null) return url

  if (url.includes('{id}')) return url.replace('{id}', id)

  return `${url}/${id}`
}

async function handleClose (done) {
  await ElMessageBox.confirm(
    t('Are you sure you want to close the window ? The updates will be lost.'),
    t('Warning'),
    {
      confirmButtonText: t('OK'),
      cancelButtonText: t('Cancel'),
      type: 'warning'
    }
  )
  done()
}

function handleEdition (data) {
  edited.value = JSON.parse(JSON.stringify(data))
  editingLoading.value = false
}

async function save () {
  const valid = await formRef.value.validate()
  if (!valid) {
    return
  }
  saving.value = true
  if (edited.value.id !== undefined)
    await api.patch(buildUrl('update', edited.value.id), edited.value)
  else await api.post(buildUrl('create'), edited.value)
  ElMessage.success(t('Item saved.'))
  saving.value = false
  editing.value = false
  emit('save')
  refreshList()
}

async function editItem (id) {
  dialogTitle.value = t('Edit item')
  editing.value = true
  editingLoading.value = true
  const data = await api.get(buildUrl('get', id))
  handleEdition(data)
}

function addItem (preset = {}) {
  dialogTitle.value = t('Add an item')
  editing.value = true
  editingLoading.value = true
  handleEdition(preset)
}

watchDebounced(
  search,
  () => {
    refreshList()
  },
  { debounce: 500, maxWait: 3000 }
)

watch([page, limit], _ => {
  refreshList()
})

async function refreshList () {
  history.pushState(
    {},
    null,
    route.path +
      '?' +
      qs.stringify({
        page: page.value,
        limit: limit.value,
        sort: sort.value,
        q: search.value.length ? search.value : undefined
      })
  )
  loading.value = true

  if (abort !== null) abort.abort()
  abort = new AbortController()

  const ret = await api.get(
    props.endpoint,
    {
      page: page.value,
      limit: limit.value,
      sort: sort.value,
      q: search.value.length ? search.value : undefined
    },
    { signal: abort.signal }
  )
  list.value = ret.docs ?? []
  total.value = ret.total ?? 0
  if (ret.page !== page.value) page.value = ret.page ?? 1
  maxPage.value = ret.maxPage ?? 1
  loading.value = false
}
refreshList()

async function deleteItem (id) {
  await ElMessageBox.confirm(
    t('Are you sure you want to delete this item ?'),
    t('Warning'),
    {
      confirmButtonText: t('OK'),
      cancelButtonText: t('Cancel'),
      type: 'warning'
    }
  )
  await api.delete(buildUrl('delete', id))
  ElMessage.success(t('Item correctly deleted.'))
  refreshList()
}
defineExpose({ refreshList, addItem, editItem })
</script>

<style lang="scss">
.crud {
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    > .el-row {
      margin: 0;
      flex-grow: 1;
    }

    .buttons {
      flex-shrink: 0;
      margin-right: 20px;
    }

    .el-input {
      margin: 0;
    }

    .sort {
      flex-shrink: 0;
      width: 40px;
      text-align: center;
    }
  }

  .sortOpened {
    margin-bottom: 16px;
  }

  .container {
    flex-grow: 1;
    overflow: auto;

    .item {
      margin-bottom: 8px;
    }
  }

  .pagination {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    margin-top: 16px;

    .text {
      text-align: center;
      flex-grow: 1;
      color: #999;
      font-size: 12px;
    }

    .el-button {
      flex-shrink: 0;
    }
  }
}

.crud-dialog {
  display: flex;
  flex-direction: column;

  > header,
  > footer {
    flex-shrink: 0;
  }

  > header {
    border-bottom: 1px solid #ccc;
    padding-bottom: 20px;
  }

  > footer {
    border-top: 1px solid #ccc;
    padding-top: 20px;
  }

  > .el-dialog__body {
    flex-grow: 1;
    overflow: auto;
  }
}
</style>
