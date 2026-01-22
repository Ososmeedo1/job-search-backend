import Joi from "joi";
import { generalRules } from "../../Utils/general-rules.utils.js";
import { validationMessages } from "../../Utils/joi-messages.utils.js";

export const addUser = {
  body: Joi.object({
    firstName: Joi.string().min(3).max(15).messages(validationMessages('First Name', 'string', 3, 15)),
    lastName: Joi.string().min(3).max(15).messages(validationMessages('Last Name', 'string', 3, 15)),
    email: Joi.string().email({minDomainSegments: 2,tlds: {allow: ['com', 'net']}}).messages(validationMessages('Email', 'string')),
    recoveryEmail: Joi.string().email({minDomainSegments: 2,tlds: {allow: ['com', 'net']}}).messages(validationMessages('Recovery Email', 'string')),
    DOB: Joi.date().min('1965-1-1').max('2011-1-1').messages(validationMessages('Date of Birth', 'date', '1965-1-1', '2011-1-1')),
    phone: Joi.string().regex(/^01[0125][0-9]{8}$/).messages(validationMessages('Phone', 'string', null, null, 'Enter valid Egyptian phone number')),
    password: Joi.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/).messages(validationMessages('Password', 'string', null, null, 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character')),
    role: Joi.string().valid('User', 'Company_HR').messages(validationMessages('Role', 'string', null, null, 'Role must be either User or Company_HR'))
  }),
  headers: Joi.object({
    ...generalRules.headers
  }).unknown(true)
}

export const login = {
  body: Joi.object({
    email: Joi.string().email({minDomainSegments: 2,tlds: {allow: ['com', 'net']}}).messages(validationMessages('Email', 'string')),
    phone: Joi.string().regex(/^01[0125][0-9]{8}$/).messages(validationMessages('Phone', 'string', null, null, 'Enter valid Egyptian phone number')),
    password: Joi.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/).messages(validationMessages('Password', 'string', null, null, 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character'))
  }).or('email', 'phone').messages({'object.missing': 'Either email or phone must be provided'}),

  headers: Joi.object({
    ...generalRules.headers
  }).unknown(true)
}

export const updateUser = {
  body: Joi.object({
    firstName: Joi.string().min(3).max(15),
    lastName: Joi.string().min(3).max(15),
    email: Joi.string().email({minDomainSegments: 2,tlds: {allow: ['com', 'net']}}),
    recoveryEmail: Joi.string().email({minDomainSegments: 2,tlds: {allow: ['com', 'net']}}),
    DOB: Joi.date().min('1965-1-1').max('2011-1-1'),
    phone: Joi.string().regex(/^01[0125][0-9]{8}$/)
  }),
  
  headers: Joi.object({
    ...generalRules.headers
  }).unknown(true)
}

export const userAccount = {
  headers: Joi.object({
    ...generalRules.headers
  }).unknown(true)
}

export const getSpecificUser = {
  headers: Joi.object({
    ...generalRules.headers
  }).unknown(true),

  params: Joi.object({
    userId: generalRules.objectId
  })
}

export const getRecoveryEmails = {
  body: Joi.object({
    recoveryEmail: Joi.string().required().email({minDomainSegments: 2,tlds: {allow: ['com', 'net']}}).messages(validationMessages('Recovery Email', 'string')) 
  }),

  headers: Joi.object({
    ...generalRules.headers
  }).unknown(true)
}

export const updatePassword =  {
  body: Joi.object({
    oldPassword: Joi.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/).required(),
    newPassword: Joi.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/).required()
  }),

  headers: Joi.object({
    ...generalRules.headers
  }).unknown(true)
}

export const forgetPassword = {
  body: Joi.object({
    email: Joi.string().email({minDomainSegments: 2,tlds: {allow: ['com', 'net']}}).required().messages(validationMessages('Email', 'string'))
  }),

  headers: Joi.object({
    ...generalRules.headers
  }).unknown(true)
}

export const resetPassword = {
  body: Joi.object({
    newPassword: Joi.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/).required().messages(validationMessages('New Password', 'string', null, null, 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character'))
  }),

  headers: Joi.object({
    ...generalRules.headers
  }).unknown(true)
}

export const checkOtp = {
  body: Joi.object({
    otpToken: generalRules.headers.token.required().messages(validationMessages('Otp token', 'string')),
    otp: Joi.string().length(6).required().messages(validationMessages('OTP', 'string', 6, 6))
  }),

  headers: Joi.object({
    ...generalRules.headers
  }).unknown(true)
}