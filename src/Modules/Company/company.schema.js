import Joi from "joi";
import { generalRules } from "../../Utils/general-rules.utils.js";
import { validationMessages } from "../../Utils/joi-messages.utils.js";

export const addCompany = {
  body: Joi.object({
    companyName: Joi.string().min(3).max(20).required().messages(validationMessages("Company Name", "string", 3, 20)),
    description: Joi.string().required().messages(validationMessages("Description", "string")),
    industry: Joi.string().required().messages(validationMessages("Industry", "string")),
    address: Joi.string().required().messages(validationMessages("Address", "string")),
    numOfEmployees: Joi.object({
      from: Joi.number().min(1).max(3000).required().messages(validationMessages("Number of Employees From", "number", 1, 3000)),
      to: Joi.number().min(2).max(10000).required().messages(validationMessages("Number of Employees To", "number", 2, 10000))
    }),
    companyEmail: Joi.string().required().email({minDomainSegments: 2,tlds: {allow: ['com', 'net']}}).messages(validationMessages("Company Email", "string")),
  }),

  headers: Joi.object({
    ...generalRules.headers
  }).unknown(true)
}

export const updateCompany = {
  body: Joi.object({
    companyName: Joi.string().min(3).max(20).optional().messages(validationMessages("Company Name", "string", 3, 20)),
    description: Joi.string().optional().messages(validationMessages("Description", "string")),
    industry: Joi.string().optional().messages(validationMessages("Industry", "string")),
    address: Joi.string().optional().messages(validationMessages("Address", "string")),
    numOfEmployees: Joi.object({
      from: Joi.number().min(1).max(3000).optional().messages(validationMessages("Number of Employees From", "number", 1, 3000)),
      to: Joi.number().min(2).max(10000).optional().messages(validationMessages("Number of Employees To", "number", 2, 10000))
    }),
    companyEmail: Joi.string().email({minDomainSegments: 2,tlds: {allow: ['com', 'net']}}).optional().messages(validationMessages("Company Email", "string"))
  }),

  headers: Joi.object({
    ...generalRules.headers
  }).unknown(true),

  params: Joi.object({
    id: generalRules.objectId.required().messages(validationMessages("Company ID", "string"))
  })
}

export const companyIdParam = {
  headers: Joi.object({
    ...generalRules.headers
  }).unknown(true),

  params: Joi.object({
    id: generalRules.objectId.required().messages(validationMessages("Company ID", "string"))
  })
}

export const getAllCompanies = {
  headers: Joi.object({
    ...generalRules.headers
  }).unknown(true)
}