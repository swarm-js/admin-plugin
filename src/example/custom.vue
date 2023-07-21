<template>
  <div class="lol">
    <el-skeleton :rows="6" animated v-if="loading" />
    <div v-else>
      {{ userDetails }}
      <el-button type="primary" @click="test">click</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { ElButton, ElSkeleton } from 'element-plus'

const api = inject('api')

const userDetails = ref(null)
const loading = ref(true)

function test () {
  console.log(userDetails.value)
}

onMounted(async _ => {
  userDetails.value = await api.get('/admin/user')
  loading.value = false
})
</script>

<style type="scss">
.lol {
  background: red;

  .el-button {
    background: yellow;
  }
}
</style>
