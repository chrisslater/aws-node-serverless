import { routes as helloRoutes } from './hello'
import { routes as usersRoutes } from './users'

export const routes = [].concat(
	usersRoutes,
	helloRoutes,
)