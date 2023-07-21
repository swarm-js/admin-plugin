import { Swarm } from '@swarmjs/core'
import { MailjetPlugin } from '@swarmjs/mailjet'
import {
  AuthPlugin,
  AuthPluginOptions,
  MongooseAuthPlugin
} from '@swarmjs/auth'
import mongoose, { ConnectOptions } from 'mongoose'
import { AdminPlugin, AdminPluginOptions, createCrud } from '../'
import path from 'path'
import { createCustom } from '../lib/tools/createCustom'

require('dotenv').config()

// 1. Create an interface representing a document in MongoDB.
interface IUser {
  firstname?: string
  lastname?: string
  email?: string
  avatar?: string
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new mongoose.Schema<IUser>({
  firstname: String,
  lastname: String,
  email: String,
  avatar: String
})

userSchema.plugin(MongooseAuthPlugin, {
  password: true,
  fido2: true,
  facebook: true,
  google: true,
  googleAuthenticator: true,
  ethereum: true
})

userSchema.plugin(MailjetPlugin, {
  apiKey: process.env.MJ_API_KEY,
  apiSecret: process.env.MJ_API_SECRET,
  fromEmail: process.env.FROM_EMAIL,
  fromName: process.env.FROM_NAME
})

// 3. Create a Model.
const User = mongoose.model<IUser>('User', userSchema)

const app = new Swarm({
  logLevel: 'info',
  title: 'My API',
  description: 'A super API made with SwarmJS',
  baseUrl: 'https://localhost:8080',
  http2: true,
  sslKeyPath: path.join(__dirname, 'localhost-key.pem'),
  sslCertPath: path.join(__dirname, 'localhost.pem')
})

app.fastify.register(require('@fastify/cors'), {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
})

app.fastify.register(require('@fastify/multipart'), {
  limits: {
    fieldNameSize: 100, // Max field name size in bytes
    fieldSize: +(process.env.FILE_UPLOAD_LIMIT ?? 5242880), // Max field value size in bytes
    fields: 10, // Max number of non-file fields
    fileSize: +(process.env.FILE_UPLOAD_LIMIT ?? 5242880), // For multipart forms, the max file size in bytes
    files: 1, // Max number of file fields
    headerPairs: 2000 // Max number of header key=>value pairs
  }
})

app.use(AuthPlugin, {
  password: true,
  fido2: true,
  facebook: false,
  google: false,
  googleAuthenticator: true,
  ethereum: true,
  model: User,
  rpName: 'SwarmJS Auth plugin test app',
  logo: 'https://www.gitbook.com/cdn-cgi/image/width=40,dpr=2,height=40,fit=contain,format=auto/https%3A%2F%2F3423608392-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FeEVq5YDGaSKNtIJG7WcF%252Ficon%252F4XDY5BBrhcqwMH6XFO06%252Flogo.png%3Falt%3Dmedia%26token%3D017a73c1-adc8-48d7-8807-bf496703eb6a',
  allowedDomains: ['localhost:3000'],
  themeColor: '#ffa000',
  logoBackgroundColor: '#fff',
  validationRequired: true
} as AuthPluginOptions)

app.use(AdminPlugin, {
  userAccessKey: 'admin',
  logo: 'https://www.gitbook.com/cdn-cgi/image/width=40,dpr=2,height=40,fit=contain,format=auto/https%3A%2F%2F3423608392-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FeEVq5YDGaSKNtIJG7WcF%252Ficon%252F4XDY5BBrhcqwMH6XFO06%252Flogo.png%3Falt%3Dmedia%26token%3D017a73c1-adc8-48d7-8807-bf496703eb6a',
  themeColor: '#ffa000',
  logoBackgroundColor: '#fff',
  title: 'SwarmJS Admin plugin test app',
  defaultCountry: 'FR',
  tabs: [
    createCrud(
      'users',
      User,
      {
        name: 'Users',
        description: 'Manage users',
        icon: 'users'
      },
      {
        create: true,
        edit: true,
        delete: true,
        fields: {
          firstname: {
            label: 'Prénom',
            type: 'text',
            required: true
          },
          lastname: {
            label: 'Nom',
            type: 'text',
            required: true
          },
          email: {
            label: 'Adresse email',
            type: 'email',
            required: true
          },
          avatar: {
            label: 'Avatar',
            type: 'image'
          }
        },
        columns: [
          { path: 'avatar', formatter: 'image', float: 'left', width: 50 },
          { path: 'firstname', label: 'First name', sortable: true },
          {
            path: 'lastname',
            label: 'Last name',
            width: 400,
            sortable: true
          },
          {
            label: 'Email address',
            width: 200,
            template: `<strong>Email is {{row.email}}</strong>`
          }
        ]
      }
    ),
    createCustom('custom', path.join(__dirname, 'custom.vue'), {
      name: 'Custom',
      icon: 'pen',
      description: 'A custom component calling API'
    })
  ]
} as AdminPluginOptions)

async function main () {
  mongoose.connect(process.env.MONGO_DSN ?? 'mongodb://localhost:27017/test', {
    useNewUrlParser: true
  } as ConnectOptions)
  await app.listen(8080)
}
main()
