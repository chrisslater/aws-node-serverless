import * as Joi from 'joi'
import * as Boom from 'boom'
import * as AWS from 'aws-sdk'
import * as uuid from 'uuid/v1'

export interface UsersRepositorySettings {
	client?: AWS.DynamoDB.DocumentClient
	schema: Joi.SchemaLike
	table: string
}

export interface IDynamoDbAdapter<Model> {
	schema: Joi.SchemaLike
	client: AWS.DynamoDB.DocumentClient
	create(model: Model): Promise<Model>
	read(): Promise<Array<Model>>
	update(model: Model): Promise<Model>
	delete(model: Model): void

	save(model: Model): Promise<Model>
	// retrieve(): Promise<Array<Model>>

	validate(model: Model): Promise<Joi.ValidationResult<Model>>
}

export interface BaseModel {
	userId?: string
}

export class DynamoDbAdapter<Model extends BaseModel> implements IDynamoDbAdapter<Model> {
	public table: string
	public schema: Joi.SchemaLike
	public client = new AWS.DynamoDB.DocumentClient({
		service: new AWS.DynamoDB({
			apiVersion: '2012-10-08',
			region: 'localhost',
			endpoint: 'http://localhost:8000'
		})
	})

	constructor(settings: UsersRepositorySettings) {
		this.schema = settings.schema
		this.table = settings.table

		if (settings && settings.client) {
			this.client = settings.client
		}
	}

	public async create(model: Model): Promise<Model> {
		model.userId = uuid()
		return this.save(model)
	}

	public read(): Promise<Array<Model>> {
		const params = {
			TableName: this.table,
		};

		const self = this

		return new Promise(function (resolve, reject) {
			// @TODO: Don't use scan, its expensive. Query as alternative?
			self.client.scan(params, function (err, data) {
				if (err) {
					reject(err)
				}

				resolve(data.Items as Model[])
			})
		})
	}

	public async update(model: Model): Promise<Model> {
		return this.save(model)
	}

	public async delete(model: Model): Promise<Model> {
		await this.validate(model)

		const params = {
			TableName: this.table,
			Key: model,
		}
		const self = this

		return new Promise<Model>(function (resolve, reject) {
			self.client.delete(params, function (err) {
				if (err) reject(err)

				resolve(model)
			})
		})
	}

	public async save(model: Model): Promise<Model> {
		await this.validate(model)

		const params = {
			TableName: this.table,
			Item: model,
		}
		const self = this

		return new Promise<Model>(function (resolve, reject) {
			self.client.put(params, function (err) {
				if (err) reject(err)

				resolve(model)
			})
		})
	}

	public async validate(model: Model): Promise<Joi.ValidationResult<Model>> {
		return await Joi.validate(model, this.schema)
	}
}
