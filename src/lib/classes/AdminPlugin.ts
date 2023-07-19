import { AdminPluginOptions } from '../interfaces/AdminPluginOptions'
import path from 'path'

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
        access: ['swarm:loggedIn'],
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
        access: ['swarm:loggedIn'],
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
        title: conf.title
      }
    }
  }
}
