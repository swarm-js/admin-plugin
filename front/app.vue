<template>
  <el-config-provider :locale="fr">
    <div id="loading" v-if="loading">
      <div class="logo">
        <img src="/images/logo.svg" alt="Loading" />
      </div>
    </div>
    <div
      v-if="!userStore.accessTo(conf.userAccessKey)"
      class="noAccess"
      :style="{
        background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4)), ${conf.themeColor}`
      }"
    >
      <div class="panel">
        <div
          class="logo"
          :style="{
            backgroundImage: `url(${conf.logo})`,
            backgroundColor: conf.logoBackgroundColor
          }"
          v-if="(conf.logo ?? '').length"
        ></div>
        <h3>{{ $t('Restricted access') }}</h3>
        <p>
          {{ $t('You are not authorized to access this area.') }}
        </p>
        <el-button type="primary" :color="conf.themeColor" @click="logout">{{
          $t('Log in with another account')
        }}</el-button>
      </div>
    </div>
    <NuxtLayout v-else>
      <NuxtPage />
    </NuxtLayout>
  </el-config-provider>
</template>

<script setup>
import { appDescription, appTitle } from './constants'
import { useUserStore } from './stores/user'
import fr from 'element-plus/dist/locale/fr.mjs'
import 'dayjs/locale/fr'
import { dayjs } from 'element-plus'
dayjs.locale('fr')

const route = useRoute()
const userStore = useUserStore()

useHead({
  titleTemplate: `${appTitle} - %s`,
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  charset: 'utf-8',
  meta: [{ name: 'description', content: appDescription }]
})

let loading = ref(true)
let conf = ref({})
let api = useApi()
provide('conf', conf)

onMounted(async () => {
  let loggedIn = false
  if (route.query.token !== undefined) {
    loggedIn = await userStore.setToken(route.query.token)
  } else {
    loggedIn = await userStore.init()
  }

  if (loggedIn) {
    const filteredQueryString = Object.keys(route.query)
      .filter(key => key !== 'token')
      .map(key => {
        return (
          encodeURIComponent(key) + '=' + encodeURIComponent(route.query[key])
        )
      })
      .join('&')
    history.pushState(
      {},
      null,
      '/admin' +
        route.path +
        `${filteredQueryString.length ? '?' + filteredQueryString : ''}`
    )
    conf.value = await api.get('/admin/conf')
  } else {
    const config = useRuntimeConfig()
    window.location.href = `${config.public.apiUrl}/auth/login?redirect=${window.location.href}`
  }
  loading.value = false
})

async function logout () {
  const config = useRuntimeConfig()
  window.location.href = `${config.public.apiUrl}/auth/login?redirect=${window.location.href}`
}
</script>

<style lang="scss">
@import '~/assets/scss/variables';

#loading {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $mainColor;

  .logo {
    opacity: 0.42;
    animation: heartbeat 1.5s ease-in-out infinite both;
  }
}

@keyframes heartbeat {
  from {
    transform: scale(1);
    transform-origin: center center;
    animation-timing-function: ease-out;
  }
  10% {
    transform: scale(0.91);
    animation-timing-function: ease-in;
  }
  17% {
    transform: scale(0.98);
    animation-timing-function: ease-out;
  }
  33% {
    transform: scale(0.87);
    animation-timing-function: ease-in;
  }
  45% {
    transform: scale(1);
    animation-timing-function: ease-out;
  }
}

.noAccess {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4)),
    $mainColor;

  .panel {
    margin: 68px 20px 20px 20px;
    background: #fff;
    padding: 40px;
    border-radius: 4px;
    box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.1);

    .logo {
      height: 96px;
      width: 96px;
      margin: -88px auto 20px auto;
      border: 5px solid #fff;
      border-radius: 96px;
      background: #fff no-repeat center center;
      background-size: cover;
    }

    h3 {
      text-align: center;
    }

    .el-button {
      width: 100%;
    }
  }
}
</style>
