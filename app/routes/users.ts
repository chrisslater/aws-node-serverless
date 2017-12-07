export const routes = []

routes.push({
	method: 'GET',
	path: '/users',
	handler: function (request) {
		return 'Hello, users!'
	},
})
