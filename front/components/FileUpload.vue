<template>
  <div class="file-upload">
    <div
      v-if="props.image"
      class="image"
      :style="{
        border: props.imageBorder,
        backgroundImage: `url(${props.modelValue})`
      }"
      @click="opened = true"
    ></div>
    <el-input v-else class="file" readonly v-model="props.modelValue">
      <template #append>
        <el-button-group>
          <el-button type="primary" @click="opened = true">
            <font-awesome-icon icon="fa-solid fa-upload"
          /></el-button>
          <el-button
            type="danger"
            @click="emit('update:modelValue', '')"
            v-if="props.modelValue"
            ><font-awesome-icon icon="fa-solid fa-trash"
          /></el-button>
        </el-button-group>
      </template>
    </el-input>
    <el-dialog v-model="opened" :title="$t('Upload a new file')" width="300px">
      <el-upload
        drag
        :action="`${config.public.apiUrl}/v1/upload`"
        :show-file-list="false"
        :on-success="handleUpload"
        :headers="{ Authorization: `Bearer ${userStore.token}` }"
        :accept="props.accept"
      >
        <el-icon class="el-icon--upload">
          <font-awesome-icon icon="fa-solid fa-upload" />
        </el-icon>
        <div class="el-upload__text">
          {{ $t('Drop file here or') }} <em>{{ $t('click to upload') }}</em>
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script setup>
import { useUserStore } from '~/stores/user'
const userStore = useUserStore()

const config = useRuntimeConfig()

const props = defineProps({
  modelValue: String,
  image: {
    type: Boolean,
    default: false
  },
  accept: {
    type: String,
    default: '*'
  },
  imageBorder: {
    type: String,
    default: '3px solid #fff'
  }
})

const emit = defineEmits(['update:modelValue'])

const opened = ref(false)

const handleUpload = response => {
  opened.value = false
  emit('update:modelValue', response.url)
}
</script>

<style lang="scss">
.file-upload {
  width: 100%;

  .image {
    background: #fff no-repeat center center;
    background-size: cover;
    border: 3px solid #fff;
    border-radius: 96px;
    height: 96px;
    width: 96px;
    margin: 0 auto;
  }
}
</style>
