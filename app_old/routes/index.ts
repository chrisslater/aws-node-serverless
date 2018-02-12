import * as Hapi from 'hapi'
import * as hello from './hello'
import * as users from './users'

export const routes = [].concat.apply(
	hello.routes,
	users.routes,
)
