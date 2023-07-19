import { AdminPluginTab } from '../interfaces/AdminPluginTab'
import { AdminPluginTabMeta } from '../interfaces/AdminPluginTabMeta'

interface CrudColumn {
  path: string
  label?: string
  width?: number
  float?: 'left' | 'right'
  formatter?: string
}

interface CreateCrudOptions {
  model: any
  title: string
  create: boolean
  edit: boolean
  delete: boolean
  fields: { [key: string]: any }
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
    ...conf
  }

  return {
    id,
    ...meta,
    type: 'crud',
    conf: opts
  }
}
