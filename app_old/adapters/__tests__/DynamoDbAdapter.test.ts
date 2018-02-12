import {
	IDynamoDbAdapter,
	DynamoDbAdapter,
} from '../DynamoDbAdapter'
import * as Boom from 'boom'
import { IUser, userSchema } from '../../schema/users';

describe('DynamoDbAdapter', () => {
	let user: IUser
	const settings = {
		table: 'users-table',
		schema: userSchema,
	}

	beforeEach(() => {
		user = {
			userId: '12345',
			firstname: 'John',
			lastname: 'Doe'
		}
	})

	describe('#create()', () => {
		let result: IUser
		const mock = jest.fn()

		beforeAll(async () => {
			const repo = new DynamoDbAdapter<IUser>(settings)
			repo.save = mock

			const userPayload = {
				firstname: 'John',
				lastname: 'Doe',
			}

			mock.mockImplementationOnce((user) => {
				return user
			})

			result = await repo.create(userPayload)
		})

		it('should generate a UUID', () => {
			expect(result.userId).toMatch(/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/)
		})
		it('should call #save()', () => {
			expect(mock).toHaveBeenCalled
		})
	})

	describe('#update()', () => {
		it('should call #save()', async () => {
			const repo = new DynamoDbAdapter<IUser>(settings)
			const mock = jest.fn()

			repo.save = mock
			await repo.update(user)

			expect(mock).toHaveBeenCalled
		})
	})

	describe('#save()', () => {
		it('should throw Error if user is not valid', async () => {
			const repo = new DynamoDbAdapter<IUser>(settings)
			const mockValidate = jest.fn()

			repo.validate = mockValidate

			const expectedError = new Error('Something broke')
			mockValidate.mockImplementationOnce(() => Promise.reject(expectedError))

			try {
				await repo.save(user)
			} catch (error) {
				expect(error).toEqual(expectedError)
			}
		})

		it('should return user if save is successful', async () => {
			const mock = jest.fn()
			const settings = {
				client: {
					put: mock
				},
				schema: userSchema,
			}

			mock.mockImplementationOnce((params, callback) => {
				callback(undefined)
			})

			// @ts-ignore
			const repo = new DynamoDbAdapter<IUser>(settings)

			const result = await repo.save(user)

			expect(result).toEqual(user)
		})
	})

	describe('#read()', () => {
		it('should return a list of Users', async () => {
			const mock = jest.fn()
			const items = [user]
			const settings = {
				client: {
					scan: mock
				},
				schema: userSchema,
			}

			mock.mockImplementationOnce((params, callback) => {
				callback(undefined, {
					Items: items,
				})
			})

			//@ts-ignore
			const repo = new DynamoDbAdapter<IUser>(settings)
			const result = await repo.read()

			expect(result).toEqual(items)
		})

		it('should throw an error', async () => {
			const mock = jest.fn()
			const settings = {
				client: {
					scan: mock
				}
			}

			mock.mockImplementation((params, callback) => {
				callback(true)
			})

			try {
				//@ts-ignore
				const repo = new DynamoDbAdapter<IUser>(settings)
				await repo.read()
			} catch (error) {
				expect(error).toEqual(true)
			}
		})
	})

	describe('#delete()', () => {
		it('should throw and Error when fails to delete', async () => {
			const mock = jest.fn()
			const adapter = Object.assign({
				client: {
					delete: mock
				}
			}, settings)

			mock.mockImplementation((params, callback) => {
				callback(true)
			})

			try {
				const repo = new DynamoDbAdapter<IUser>(adapter)
				// @ts-ignore Ignoring error for test
				await repo.delete()
			} catch (error) {
				expect(error).toEqual(true)
			}
		})
	})

	describe('#validate()', () => {
		it('should return model when the model does match the schema', async () => {
			const repo = new DynamoDbAdapter(settings)

			const result = await repo.validate(user)

			expect(result).toEqual(user)
		})

		it('should throw ValidationError when the model does not match the schema', async () => {
			const repo = new DynamoDbAdapter(settings)

			const user: IUser = {
				firstname: 'John',
				// @ts-ignore Ignoring error for test
				surname: 'Doe'
			}

			try {
				const result = await repo.validate(user)
			} catch (err) {
				expect(err.name).toEqual('ValidationError')
				expect(err.message).toEqual('"surname" is not allowed')
			}
		})
	})
})