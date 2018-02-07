import { Callback, Context } from 'aws-lambda'
import * as Boom from 'boom'
import * as hello from '@snapperfish/library-hello'

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

export const handler = (event: Event, context: Context, callback: Callback) => {

	try {
		const response = {
			statusCode: 200,
			body: JSON.stringify(hello.hello('Chris')),
			isBase64Encoded: false
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

	// callback(Boom.badRequest('Ouch'))
	// callback(null, { hello: 'world!' })
};