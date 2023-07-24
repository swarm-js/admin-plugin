import { AdminPluginTab } from './AdminPluginTab'

export interface AdminPluginOptions {
  controllerName: string
  userAccessKey: string | null
  logo: string
  themeColor: string
  logoBackgroundColor: string
  title: string
  tabs: AdminPluginTab[]
  firstnameField: string
  lastnameField: string
  emailField: string
  avatarField: string
  defaultCountry: string
  allowedMimeTypes: string[]
  uploadMaxFileSize: number
  s3ApiKey: string
  s3ApiSecret: string
  s3Region: string
  s3Endpoint: string
  s3Bucket: string
}
