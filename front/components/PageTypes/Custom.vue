<template>
  <parsedComponent />
</template>

<script setup>
import * as Vue from 'vue'
import { loadModule } from 'vue3-sfc-loader'
import { v4 as uuid } from 'uuid'
import * as ElementPlus from 'element-plus'

const props = defineProps({
  conf: {}
})

function parseToComponent (files, indexFile) {
  const id = uuid()
  const options = {
    moduleCache: { vue: Vue, 'element-plus': ElementPlus },
    async getFile (url) {
      const file = files.find(file => file.path === url)
      if (file) return Promise.resolve(file.src)
      return Promise.reject()
    },
    addStyle (styleString) {
      let style = document.getElementById(id)
      if (!style) {
        style = document.createElement('style')
        style.setAttribute('id', uuid())
        const ref = document.head.getElementsByTagName('style')[0] || null
        document.head.insertBefore(style, ref)
      }
      style.textContent = styleString
    }
  }
  const component = loadModule(indexFile, options)
  return Vue.defineAsyncComponent(() => component)
}

const parsedComponent = Vue.markRaw(
  props.conf.mode === 'single'
    ? parseToComponent(
        [{ path: props.conf.path, src: props.conf.src }],
        props.conf.path
      )
    : parseToComponent(props.conf.files, props.conf.indexFile)
)
</script>
