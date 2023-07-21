import { AdminPluginTab } from '../interfaces/AdminPluginTab'
import { AdminPluginTabMeta } from '../interfaces/AdminPluginTabMeta'
import fs from 'fs'

export function createCustom (
  id: string,
  path: string,
  meta: AdminPluginTabMeta
): AdminPluginTab {
  const vueComponentFile = fs.readFileSync(path)

  return {
    id,
    ...meta,
    type: 'custom',
    conf: {
      mode: 'single',
      path,
      src: vueComponentFile.toString()
    }
  }
}

export function createCustomWithMultipleFiles (
  id: string,
  paths: string[],
  indexFile: string,
  meta: AdminPluginTabMeta
): AdminPluginTab {
  const files = paths.map((path: string) => ({
    path,
    src: fs.readFileSync(path)
  }))

  return {
    id,
    ...meta,
    type: 'custom',
    conf: {
      mode: 'multiple',
      files,
      indexFile
    }
  }
}
