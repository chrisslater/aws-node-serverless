import * as Joi from 'joi'

export interface IUser {
	userId?: string
	firstname: string
	lastname: string
}

export const userSchema = {
	userId: Joi.string(),
	firstname: Joi.string(),
	lastname: Joi.string(),
}