import { AdminPluginTab } from '../interfaces/AdminPluginTab'
import { AdminPluginTabMeta } from '../interfaces/AdminPluginTabMeta'

interface CrudColumn {
  path?: string
  formatter?: string
  template?: string
  label?: string
  width?: number
  float?: 'left' | 'right'
  sortable?: boolean
  sortField?: string
}

interface CreateCrudOptions {
  model: any
  title: string
  create: boolean
  edit: boolean
  delete: boolean
  fields: { [key: string]: any }
  sort: string
  limit: number
  columns: CrudColumn[]
}

export function createCrud (
  id: string,
  model: any,
  meta: AdminPluginTabMeta,
  conf: Partial<CreateCrudOptions> = {}
): AdminPluginTab {
  const opts: CreateCrudOptions = {
    model,
    title: meta.name,
    create: false,
    edit: false,
    delete: false,
    fields: {},
    columns: [],
    sort: '-_id',
    limit: 10,
    ...conf
  }

  return {
    id,
    ...meta,
    type: 'crud',
    conf: opts
  }
}
