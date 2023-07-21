<template>
  <component :is="types[tabConf.type]" :conf="tabConf.conf" />
</template>

<script setup>
import TypeCrud from '~/components/PageTypes/Crud'
import TypeCustom from '~/components/PageTypes/Custom'

const types = {
  crud: TypeCrud,
  custom: TypeCustom
}

const route = useRoute()
const router = useRouter()
const conf = inject('conf')
const tabConf = (conf.value.tabs ?? []).find(t => t.id === route.params.tabId)
if (!tabConf) router.push('/')

useState('title').value = tabConf.name
</script>
