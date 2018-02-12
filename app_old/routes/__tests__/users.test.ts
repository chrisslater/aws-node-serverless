jest.mock('../../adapters/DynamoDbAdapter', () => {
	const create = jest.fn()
	const read = jest.fn()

	create.mockImplementationOnce(() => Promise.resolve('DB create result'))
	read.mockImplementationOnce(() => Promise.resolve('DB read result'))

	return {
		DynamoDbAdapter: function () {
			return {
				create,
				read,
			}
		}
	}
})

import { getUsersHandler, postUsersHandler } from '../users'

describe('Users routes', () => {
	describe('getUsersHandler()', () => {
		it('should call db.read()', async () => {
			const result = await getUsersHandler()

			expect(result).toEqual('DB read result')
		})
	})

	describe('postUsersHandler()', () => {
		it('should call db.create()', async () => {
			const request = {
				payload: {
					firstname: 'John',
					lastname: 'Doe',
				}
			}
			const result = await postUsersHandler(request)

			expect(result).toEqual('DB create result')
		})
	})
})
