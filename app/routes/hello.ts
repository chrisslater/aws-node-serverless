import * as Hapi from 'hapi'

export const routes: Hapi.RouteConfiguration[] = [{
	method: 'GET',
	path: '/',
	handler: function () {
		return 'Hello, worlds!'
	},
}]