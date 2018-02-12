import * as Joi from 'joi';
export interface IUser {
    userId?: string;
    firstname: string;
    lastname: string;
}
export declare const userSchema: {
    userId: Joi.StringSchema;
    firstname: Joi.StringSchema;
    lastname: Joi.StringSchema;
};
