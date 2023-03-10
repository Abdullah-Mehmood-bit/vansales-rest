const Joi = require('@hapi/joi')

const usernameSchema = Joi.string()
	.trim()
	.min(3)
	.max(255)
	.required()
	.label('UserName')
	.messages({
		'string.base': 'Invalid type, User Name must be string',
		'string.empty': 'Please enter your user name',
		'string.min': 'User name must be at least of 3 characters',
		'string.max': 'User name must be lower than 255 letters',
		'any.required': 'User Name is required',
	})

const passwordSchema = Joi.string()
	.min(8)
	.max(255)
	.required()
	.label('Password')
	.alphanum()
	.messages({
		'string.base': 'Invalid type, password must be string',
		'string.empty': 'Please enter your password',
		'string.min': 'Password should be at least of 8 characters',
		'string.max': 'Password should be less than of 255 letters',
		'any.required': 'Password is required',
	})

const emailSchema = Joi.string()
    .email()
    .trim()
	.label('Email')
    .required()
    


const loginSchema = Joi.object({
	username: usernameSchema,
	password: passwordSchema,
})

const signupSchema = Joi.object({
	username: usernameSchema,
	email: emailSchema,
	password: passwordSchema,
	repeat_password: passwordSchema,
})

const schema = {
	loginSchema,
    signupSchema,
    emailSchema,
    usernameSchema,
    passwordSchema,
}

module.exports = schema