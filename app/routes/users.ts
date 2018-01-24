import * as Hapi from 'hapi'
import * as Boom from 'boom'

import * as Users from '../schema/users'
import * as Adapters from '../adapters'

export const routes: Hapi.RouteConfiguration[] = []

const db = new Adapters.DynamoDbAdapter<Users.IUser>({
	table: 'users-table',
	schema: Users.userSchema,
})

export async function getUsersHandler(request: Hapi.Request): Promise<Users.IUser[]> {
	return await db.read()
}

routes.push({
	method: 'GET',
	path: '/users',
	handler: getUsersHandler,
})

export async function postUsersHandler(request: Hapi.Request): Promise<Users.IUser> {
	const payload: Users.IUser = request.payload

	if (!payload) throw Boom.badRequest('Bad data')

	try {
		return await db.create(payload)
	} catch (error) {
		switch (error.name) {
			case 'ValidationError':
				throw Boom.badRequest(error.message)
			default:
				throw error
		}
	}
}

routes.push({
	method: 'POST',
	path: '/users',
	handler: postUsersHandler,
})
