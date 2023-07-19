export interface AdminPluginTab {
  id: string
  name: string
  description: string
  icon: string
  type: 'crud' | 'custom'
  conf: { [key: string]: any }
}
