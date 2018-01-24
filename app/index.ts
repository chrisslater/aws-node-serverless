import { Callback, Context } from 'aws-lambda'
import * as Hapi from 'hapi'
import * as Routes from './routes'

type HttpMethod = 'GET' | 'POST'

interface Headers {
  Accept: string
  'Accept-Encoding': string
  'Accept-Language': string
  'Cache-Control': string
  Connection: string
  Host: string
  Pragma: string
  'Upgrade-Insecure-Requests': string
  'User-Agent': 'string'
}

interface Event {
  body: any
  headers: Headers
  httpMethod: HttpMethod
  isOffline: boolean
  path: string
  pathParameters: any
  queryStringParameters: any
  requestContext: any
  resource: string
  stageVariables: any
}

interface Response {
  statusCode: number
  body: string
}

// @ts-ignore Will be solved when @types/hapi updates to v17
const server = Hapi.Server() as Hapi.Server



Routes.routes.forEach((route: Hapi.RouteConfiguration) => server.route(route))

interface HapiRequest {
  method: string
  url: string
  payload: any
  headers: any
  validate: boolean
}

export const handler = async (event: Event, context: Context, callback: Callback) => {
  const options: HapiRequest | Hapi.InjectedRequestOptions = {
    method: event.httpMethod,
    url: event.path,
    payload: event.body,
    headers: event.headers,
    validate: false
  };

  const res = await server.inject(options)

  const response = {
    statusCode: res.statusCode,
    body: res.payload
  }

  callback(null, response)
};