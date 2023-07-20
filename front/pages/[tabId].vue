<template>
  <component :is="types[tabConf.type]" :conf="tabConf.conf" />
</template>

<script setup>
import TypeCrud from '~/components/PageTypes/Crud'

const types = {
  crud: TypeCrud
}

const route = useRoute()
const router = useRouter()
const conf = inject('conf')
const tabConf = (conf.value.tabs ?? []).find(t => t.id === route.params.tabId)
if (!tabConf) router.push('/')

useState('title').value = tabConf.name
</script>
