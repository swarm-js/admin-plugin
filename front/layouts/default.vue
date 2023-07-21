<template>
  <el-drawer v-model="drawer" :with-header="false" direction="ltr" size="300px">
    <div class="mobile-aside">
      <header v-if="(conf.logo ?? '').length">
        <div
          class="logo"
          :style="{ backgroundImage: `url(${conf.logo})` }"
        ></div>
      </header>
      <footer>
        <div
          class="avatar"
          :style="{ backgroundImage: `url(${userStore.user.avatar})` }"
        ></div>
        <div class="name">
          {{ userStore.user.firstname }} {{ userStore.user.lastname }}
        </div>
        <div class="email">{{ userStore.user.email }}</div>
        <div class="buttons">
          <el-button @click="logout">
            <font-awesome-icon :icon="['fas', 'right-from-bracket']" />
          </el-button>
        </div>
      </footer>
      <nav>
        <ul>
          <li>
            <nuxt-link href="/" :class="{ active: page === '' }">
              <div class="icon">
                <font-awesome-icon :icon="['fas', 'house']" />
              </div>
              <div class="label">{{ $t('Home') }}</div>
            </nuxt-link>
          </li>
          <li v-for="tab in conf.tabs">
            <nuxt-link
              :href="`/${tab.id}`"
              :class="{ active: page === tab.id }"
            >
              <div class="icon">
                <font-awesome-icon :icon="['fas', tab.icon]" />
              </div>
              <div class="label">{{ tab.name }}</div>
            </nuxt-link>
          </li>
        </ul>
      </nav>
    </div>
  </el-drawer>
  <div id="admin-panel">
    <aside class="hidden-sm-and-down">
      <header v-if="(conf.logo ?? '').length">
        <div
          class="logo"
          :style="{ backgroundImage: `url(${conf.logo})` }"
        ></div>
      </header>
      <nav>
        <ul>
          <li>
            <nuxt-link href="/" :class="{ active: page === '' }">
              <div class="icon">
                <font-awesome-icon :icon="['fas', 'house']" />
              </div>
              <div class="label">{{ $t('Home') }}</div>
            </nuxt-link>
          </li>
          <li v-for="tab in conf.tabs">
            <nuxt-link
              :href="`/${tab.id}`"
              :class="{ active: page === tab.id }"
            >
              <div class="icon">
                <font-awesome-icon :icon="['fas', tab.icon]" />
              </div>
              <div class="label">{{ tab.name }}</div>
            </nuxt-link>
          </li>
        </ul>
      </nav>
      <footer>
        <div
          class="avatar"
          :style="{ backgroundImage: `url(${userStore.user.avatar})` }"
        ></div>
        <div class="name">
          {{ userStore.user.firstname }} {{ userStore.user.lastname }}
        </div>
        <div class="email">{{ userStore.user.email }}</div>
        <div class="buttons">
          <el-button @click="logout">
            <font-awesome-icon :icon="['fas', 'right-from-bracket']" />
          </el-button>
        </div>
      </footer>
    </aside>
    <main>
      <header>
        <div class="menu hidden-md-and-up" @click="drawer = true">
          <font-awesome-icon :icon="['fas', 'bars']" />
        </div>
        <div class="title">
          {{ title }}
        </div>
        <div class="actions">
          <el-button
            v-for="button in buttons"
            :type="button.type"
            plain
            :color="button.color"
            @click="button.action()"
            >{{ button.label }}</el-button
          >
          <el-dropdown
            v-if="actions.length"
            @command="actions[$event].action()"
            trigger="click"
          >
            <el-button :color="conf.themeColor" plain>
              {{ $t('Actions') }}
              <font-awesome-icon :icon="['fas', 'angle-down']" />
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="(action, idx) in actions"
                  :command="idx"
                  >{{ action.label }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>
      <div class="content">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import InlineSvg from 'vue-inline-svg'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '~/stores/user'
const { t } = useI18n({ useScope: 'global' })

const conf = inject('conf')
const userStore = useUserStore()

const title = useState('title', '')
const actions = useState('actions', _ => [])
const buttons = useState('buttons', _ => [])
const drawer = ref(false)
const route = useRoute()
const router = useRouter()
const api = useApi()

onMounted(_ => {
  setInterval(async _ => {
    const ret = await api.post('/auth/renew')
    await userStore.setToken(ret.token)
  }, 1000 * 60 * 5) // 5 minutes
})

async function logout () {
  await userStore.logout()
  window.location.href = '/admin/'
}
</script>

<style lang="scss">
@import '~/assets/scss/variables';

$asideWidth: 300px;
$asidePadding: 30px;
$asideMenuColor: #858585;
$mainColor: v-bind('conf.themeColor');

.mobile-aside {
  > header {
    flex-shrink: 0;
    margin-bottom: 20px;

    > .logo {
      height: 50px;
      background: transparent no-repeat top left;
      background-size: contain;
    }
  }

  > nav {
    flex-grow: 1;
    overflow: auto;

    > ul {
      list-style: none;
      padding: 0;

      a {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: $asideMenuColor;
        height: 55px;
        border-radius: 12px;

        .icon {
          flex-shrink: 0;
          text-align: center;
          width: 60px;
          font-size: 16px;
        }

        .label {
          flex-grow: 1;
          font-weight: 500;
          font-size: 15px;
        }

        &.router-link-active {
          background: #333;
          color: #fff;
        }
      }
    }
  }

  > footer {
    flex-shrink: 0;
    border-top: 1px solid #f5f4f2;
    border-bottom: 1px solid #f5f4f2;
    padding: 12px 0;

    > .avatar {
      margin: 0 auto 8px auto;
      height: 48px;
      width: 48px;
      border-radius: 48px;
      background: transparent no-repeat center center;
      background-size: cover;
    }

    > .name {
      font-weight: 700;
      text-align: center;
      font-size: 15px;
      margin-bottom: 6px;
    }

    > .email {
      font-size: 13px;
      color: #888;
      text-align: center;
      margin-bottom: 6px;
    }

    > .buttons {
      text-align: center;
    }
  }
}

#admin-panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  width: 100vw;
  width: 100dvw;
  height: 100%;
  height: 100vh;
  height: 100dvh;
  display: flex;

  aside {
    flex-shrink: 0;
    width: $asideWidth;
    padding: $asidePadding;
    border-right: 1px solid #f5f4f2;
    display: flex;
    flex-direction: column;

    > header {
      flex-shrink: 0;
      margin-bottom: 30px;

      > .logo {
        height: 50px;
        background: transparent no-repeat top left;
        background-size: contain;
      }
    }

    > nav {
      flex-grow: 1;
      overflow: auto;

      > ul {
        list-style: none;
        padding: 0;

        a {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: $asideMenuColor;
          height: 55px;
          border-radius: 12px;

          .icon {
            flex-shrink: 0;
            text-align: center;
            width: 60px;
            font-size: 16px;
          }

          .label {
            flex-grow: 1;
            font-weight: 500;
            font-size: 15px;
          }

          &.router-link-active {
            background: $mainColor;
            color: #fff;
          }
        }
      }
    }

    > footer {
      flex-shrink: 0;
      border-top: 1px solid #f5f4f2;

      > .avatar {
        margin: 12px auto 8px auto;
        height: 48px;
        width: 48px;
        border-radius: 48px;
        background: transparent no-repeat center center;
        background-size: cover;
      }

      > .name {
        font-weight: 700;
        text-align: center;
        font-size: 15px;
        margin-bottom: 6px;
      }

      > .email {
        font-size: 13px;
        color: #888;
        text-align: center;
        margin-bottom: 6px;
      }

      > .buttons {
        text-align: center;
      }
    }
  }

  main {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    > header {
      flex-shrink: 0;
      padding: 30px;
      display: flex;
      align-items: center;

      .menu {
        flex-shrink: 0;
        margin-right: 20px;
        height: 36px;
        width: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #f5f4f2;
        border-radius: 4px;
        cursor: pointer;
      }

      .title {
        font-size: 36px;
        font-weight: 700;
        flex-grow: 1;
      }

      .el-dropdown {
        margin-left: 12px;

        .el-button svg {
          margin-left: 8px;
        }
      }

      .el-button {
        padding: 12px 18px;
        height: 36px;
        font-weight: 700;
      }
    }

    > .content {
      flex-grow: 1;
      overflow: auto;
      padding: 30px;
    }
  }
}
</style>
