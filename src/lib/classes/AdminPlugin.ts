import { AdminPluginOptions } from '../interfaces/AdminPluginOptions'
import path from 'path'
import { Crud } from '@swarmjs/crud'
import { AdminPluginTab } from '../interfaces/AdminPluginTab'
import { FastifyReply } from '@swarmjs/core'
import { NotFound } from 'http-errors'

let swarm: any
let conf: AdminPluginOptions

export class AdminPlugin {
  static setup (instance: any, options: Partial<AdminPluginOptions> = {}) {
    swarm = instance

    conf = {
      controllerName: 'AdminPlugin',
      userAccessKey: 'admin',
      title: '',
      logo: '',
      themeColor: '#ffa000',
      logoBackgroundColor: 'transparent',
      tabs: [],
      firstnameField: 'firstname',
      lastnameField: 'lastname',
      emailField: 'email',
      avatarField: 'avatar',
      defaultCountry: 'US',
      ...options
    }

    swarm.fastify.register(require('@fastify/static'), {
      root: path.join(__dirname, '../../../front/.output/public'),
      prefix: '/admin',
      redirect: true,
      index: 'index.html',
      decorateReply: false
    })

    instance.controllers.addController(conf.controllerName, {
      title: 'Admin panel',
      description: 'Handles admin panel',
      prefix: '/admin',
      root: true
    })

    swarm.controllers.addMethod(
      conf.controllerName,
      AdminPlugin.getUser(swarm, conf),
      {
        method: 'GET',
        route: '/user',
        title: 'Returns user details',
        access: [conf.userAccessKey],
        returns: [
          {
            code: 200,
            description: 'User details',
            mimeType: 'application/json',
            schema: {
              type: 'object',
              properties: {
                firstname: { type: 'string' },
                lastname: { type: 'string' },
                email: { type: 'string' },
                avatar: { type: 'string' },
                access: { type: 'array', items: { type: 'string' } }
              }
            }
          }
        ]
      }
    )

    swarm.controllers.addMethod(
      conf.controllerName,
      AdminPlugin.getConf(swarm, conf),
      {
        method: 'GET',
        route: '/conf',
        title: 'Returns plugin configuration',
        access: [conf.userAccessKey],
        returns: [
          {
            code: 200,
            description: 'Configuration',
            mimeType: 'application/json',
            schema: {
              type: 'object',
              properties: {
                userAccessKey: { type: 'string' },
                logo: { type: 'string' },
                themeColor: { type: 'string' },
                logoBackgroundColor: { type: 'string' },
                title: { type: 'string' },
                defaultCountry: { type: 'string' },
                tabs: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                      description: { type: 'string' },
                      icon: { type: 'string' },
                      type: { type: 'string', enum: ['crud', 'custom'] },
                      conf: { type: 'object', additionalProperties: true }
                    }
                  }
                }
              }
            }
          }
        ]
      }
    )

    swarm.controllers.addMethod(
      conf.controllerName,
      AdminPlugin.list(swarm, conf),
      {
        method: 'GET',
        route: '/tab/:tabId/crud',
        title: 'List items in a model',
        access: [conf.userAccessKey],
        parameters: [
          { name: 'tabId', schema: { type: 'string' }, description: 'Tab ID' }
        ],
        returns: [
          {
            code: 200,
            description: 'Item list',
            mimeType: 'application/json',
            schema: {
              type: 'object',
              properties: {
                docs: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: true
                  }
                },
                page: {
                  type: 'number'
                },
                limit: {
                  type: 'number'
                },
                total: {
                  type: 'number'
                },
                maxPage: {
                  type: 'number'
                }
              }
            }
          }
        ]
      }
    )

    swarm.controllers.addMethod(
      conf.controllerName,
      AdminPlugin.get(swarm, conf),
      {
        method: 'GET',
        route: '/tab/:tabId/crud/:id',
        title: 'Get item in a model',
        access: [conf.userAccessKey],
        parameters: [
          { name: 'tabId', schema: { type: 'string' }, description: 'Tab ID' },
          {
            name: 'id',
            schema: { type: 'string', pattern: '^[0-9a-f]{24}$' },
            description: 'Item ID'
          }
        ],
        returns: [
          {
            code: 200,
            description: 'Item',
            mimeType: 'application/json',
            schema: {
              type: 'object',
              additionalProperties: true
            }
          }
        ]
      }
    )

    swarm.controllers.addMethod(
      conf.controllerName,
      AdminPlugin.create(swarm, conf),
      {
        method: 'POST',
        route: '/tab/:tabId/crud',
        title: 'Create item in a model',
        access: [conf.userAccessKey],
        parameters: [
          { name: 'tabId', schema: { type: 'string' }, description: 'Tab ID' }
        ],
        accepts: {
          mimeType: 'application/json',
          schema: {
            type: 'object',
            additionalProperties: true
          }
        },
        returns: [
          {
            code: 201,
            description: 'Item created',
            mimeType: 'application/json',
            schema: {
              type: 'object',
              properties: {}
            }
          }
        ]
      }
    )

    swarm.controllers.addMethod(
      conf.controllerName,
      AdminPlugin.update(swarm, conf),
      {
        method: 'PATCH',
        route: '/tab/:tabId/crud/:id',
        title: 'Update item in a model',
        access: [conf.userAccessKey],
        parameters: [
          { name: 'tabId', schema: { type: 'string' }, description: 'Tab ID' },
          {
            name: 'id',
            schema: { type: 'string', pattern: '^[0-9a-f]{24}$' },
            description: 'Item ID'
          }
        ],
        accepts: {
          mimeType: 'application/json',
          schema: {
            type: 'object',
            additionalProperties: true
          }
        },
        returns: [
          {
            code: 200,
            description: 'Item updated',
            mimeType: 'application/json',
            schema: {
              type: 'object',
              properties: {}
            }
          }
        ]
      }
    )

    swarm.controllers.addMethod(
      conf.controllerName,
      AdminPlugin.update(swarm, conf),
      {
        method: 'DELETE',
        route: '/tab/:tabId/crud/:id',
        title: 'Delete item in a model',
        access: [conf.userAccessKey],
        parameters: [
          { name: 'tabId', schema: { type: 'string' }, description: 'Tab ID' },
          {
            name: 'id',
            schema: { type: 'string', pattern: '^[0-9a-f]{24}$' },
            description: 'Item ID'
          }
        ],
        returns: [
          {
            code: 204,
            description: 'Item deleted',
            mimeType: 'application/json',
            schema: {
              type: 'object',
              properties: {}
            }
          }
        ]
      }
    )
  }

  static getUser (_: any, conf: AdminPluginOptions) {
    return async function getUser (request: any) {
      return {
        firstname: request.user[conf.firstnameField] ?? '',
        lastname: request.user[conf.lastnameField] ?? '',
        email: request.user[conf.emailField] ?? '',
        avatar: request.user[conf.avatarField] ?? '',
        access: request.user.swarmUserAccess ?? []
      }
    }
  }

  static getConf (_: any, conf: AdminPluginOptions) {
    return async function getConf () {
      return {
        tabs: conf.tabs,
        userAccessKey: conf.userAccessKey,
        logo: conf.logo,
        themeColor: conf.themeColor,
        logoBackgroundColor: conf.logoBackgroundColor,
        title: conf.title,
        defaultCountry: conf.defaultCountry
      }
    }
  }

  static list (_: any, conf: AdminPluginOptions) {
    return async function listItems (request: any, reply: FastifyReply) {
      const tab = conf.tabs.find(
        (tab: AdminPluginTab) => tab.id === request.params.tabId
      )
      if (!tab) throw new NotFound()
      const crud = new Crud(tab.conf.model)
      return crud.list(request, reply)
    }
  }

  static create (_: any, conf: AdminPluginOptions) {
    return async function createItem (request: any, reply: FastifyReply) {
      const tab = conf.tabs.find(
        (tab: AdminPluginTab) => tab.id === request.params.tabId
      )
      if (!tab) throw new NotFound()
      const crud = new Crud(tab.conf.model)
      return crud.create(request, reply)
    }
  }

  static get (_: any, conf: AdminPluginOptions) {
    return async function getItem (request: any, reply: FastifyReply) {
      const tab = conf.tabs.find(
        (tab: AdminPluginTab) => tab.id === request.params.tabId
      )
      if (!tab) throw new NotFound()
      const crud = new Crud(tab.conf.model)
      return crud.get(request, reply)
    }
  }

  static update (_: any, conf: AdminPluginOptions) {
    return async function updateItem (request: any, reply: FastifyReply) {
      const tab = conf.tabs.find(
        (tab: AdminPluginTab) => tab.id === request.params.tabId
      )
      if (!tab) throw new NotFound()
      const crud = new Crud(tab.conf.model)
      return crud.update(request, reply)
    }
  }

  static delete (_: any, conf: AdminPluginOptions) {
    return async function deleteItem (request: any, reply: FastifyReply) {
      const tab = conf.tabs.find(
        (tab: AdminPluginTab) => tab.id === request.params.tabId
      )
      if (!tab) throw new NotFound()
      const crud = new Crud(tab.conf.model)
      return crud.delete(request, reply)
    }
  }
}
