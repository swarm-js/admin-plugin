<template>
  <el-row :gutter="20">
    <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="tab in conf.tabs">
      <div class="tab-preview" @click="$router.push(`/${tab.id}`)">
        <div class="icon">
          <font-awesome-icon :icon="['fas', tab.icon]" />
        </div>
        <div class="title">{{ tab.name }}</div>
        <div class="description">{{ tab.description }}</div>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n({ useScope: 'global' })
useState('title').value = t('Home')
useState('buttons').value = []
useState('actions').value = []
const conf = inject('conf')
// useState('buttons').value = [
//   {
//     label: 'One button',
//     type: 'danger',
//     action () {
//       console.log('one button')
//     }
//   },
//   {
//     label: 'Another button',
//     color: 'blue',
//     action () {
//       console.log('another button')
//     }
//   },
//   {
//     label: 'Again button',
//     action () {
//       console.log('again button')
//     }
//   }
// ]
// useState('actions').value = [
//   {
//     label: 'One button',
//     type: 'danger',
//     action () {
//       console.log('one button')
//     }
//   },
//   {
//     label: 'Another button',
//     color: 'blue',
//     action () {
//       console.log('another button')
//     }
//   },
//   {
//     label: 'Again button',
//     action () {
//       console.log('again button')
//     }
//   }
// ]
</script>

<style lang="scss">
.tab-preview {
  border: 1px solid #e7e7e7;
  border-radius: 4px;
  cursor: pointer;
  padding: 20px;
  transition: all ease-out 100ms;

  &:hover {
    color: v-bind('conf.themeColor');
    border-color: v-bind('conf.themeColor');
  }

  .icon {
    font-size: 16px;
  }

  .title {
    font-size: 18px;
    font-weight: 700;
    margin: 12px 0;
  }

  .description {
    color: #838383;
    font-size: 12px;
  }
}
</style>
