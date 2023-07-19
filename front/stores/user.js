import { useStorage } from '@vueuse/core'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      loggedIn: false,
      user: null,
      token: null
    }
  },

  actions: {
    accessTo (name) {
      return (this.user?.access ?? []).includes(name)
    },
    async setToken (newToken) {
      const token = await useStorage('token', '')
      token.value = newToken
      this.token = newToken
      await this.refreshUserData()
      return this.loggedIn
    },
    async logout () {
      const token = await useStorage('token', '')
      token.value = null
      this.token = ''
      this.loggedIn = false
      this.user = null
    },
    async refreshUserData () {
      try {
        if (!this.token) throw new Error('Not logged in')
        const api = useApi()
        const userData = await api.get(`/admin/user`)
        this.loggedIn = true
        this.user = userData
      } catch (err) {
        this.loggedIn = false
        this.user = null
        this.token = null
      }
    },
    async init () {
      const token = await useStorage('token', '')
      if (!token.value) return false
      this.token = token.value
      await this.refreshUserData()
      return this.loggedIn
    },
    async login () {
      this.count++
    }
  }
})
