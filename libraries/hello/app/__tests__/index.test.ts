import { hello } from '../index'

describe('hello()', () => {
	it('should return Hello World!', () => {
		expect(hello('World!')).toEqual('Hello World!')
	})
})