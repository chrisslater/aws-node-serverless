// let start = process.hrtime();

// const elapsed_time = function (note: string) {
//   var precision = 3; // 3 decimal places
//   var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
//   console.log(process.hrtime(start)[0] + " s, " + elapsed.toFixed(precision) + " ms - " + note); // print message + time
//   start = process.hrtime(); // reset the timer
// }

import { Callback, Context } from 'aws-lambda'
import * as Hapi from 'hapi'
import * as Boom from 'boom'
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
  'User-Agent': string
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
const server = new Hapi.Server({}) as Hapi.Server

server.connection({ port: 3000 });

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

  try {
    console.log('heed');
    const res = await server.inject(options)

    const response = {
      statusCode: 200,
      body: 'lol'
    }

    callback(null, response)
  } catch (error) {
    console.log('hello', error.name);
    switch (error.name) {
      case 'ValidationError':
        throw Boom.badRequest(error.message)
      default:
        throw error
    }
  }
};