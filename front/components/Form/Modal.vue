<template>
  <el-dialog
    class="form-modal"
    v-model="opened"
    :title="dialogTitle"
    width="100%"
    :before-close="handleClose"
    destroy-on-close
  >
    <form-filler ref="formRef" v-model="editedValues" :conf="editedConf" />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">{{ $t('Cancel') }}</el-button>
        <el-button type="primary" @click="save">
          {{ $t('OK') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n({ useScope: 'global' })

let resolve = null
let reject = null

const editedConf = ref(null)
const editedValues = ref({})
const opened = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)

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
  reject()
  done()
}

function close () {
  reject()
  opened.value = false
}

async function save () {
  const valid = await formRef.value.validate()
  if (!valid) return

  resolve(editedValues.value)
  opened.value = false
}

function fill (title, conf, values = {}) {
  return new Promise((res, rej) => {
    resolve = res
    reject = rej

    dialogTitle.value = title
    editedValues.value = values
    editedConf.value = conf
    opened.value = true
  })
}
defineExpose({ fill })
</script>
