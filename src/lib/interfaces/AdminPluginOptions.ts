import { AdminPluginTab } from './AdminPluginTab'

export interface AdminPluginOptions {
  controllerName: string
  userAccessKey: string
  logo: string
  themeColor: string
  logoBackgroundColor: string
  title: string
  tabs: AdminPluginTab[]
  firstnameField: string
  lastnameField: string
  emailField: string
  avatarField: string
}
