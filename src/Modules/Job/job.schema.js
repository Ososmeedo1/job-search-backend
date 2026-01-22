import Joi from 'joi'
import { generalRules } from '../../Utils/general-rules.utils.js'
import { validationMessages } from '../../Utils/joi-messages.utils.js'


export const addJob = {
  body: Joi.object({
    jobTitle: Joi.string().min(3).max(20).required().messages(validationMessages("Job Title", 3, 20)),
    jobLocation: Joi.string().valid('onsite', 'remotley', 'hybrid').required().messages(validationMessages("Job Location", 3, 20)),
    workingTime: Joi.string().valid('part-time', 'full-time').required().messages(validationMessages("Working Time")),
    experience: Joi.number().min(0).max(30).required().messages(validationMessages("Experience", 0, 30)),
    jobDescription: Joi.string().min(10).max(1000).required().messages(validationMessages("Job Description", 10, 1000)),
    technicalSkills: Joi.array().min(1).max(100).required().messages(validationMessages("Technical Skills", 1, 100)),
    softSkills: Joi.array().min(1).max(50).optional().messages(validationMessages("Soft Skills", 1, 50)),
  }),

  headers: Joi.object({
    ...generalRules.headers
  }).unknown(true),

  params: Joi.object({
    companyId: generalRules.objectId
  })
}

export const updateJob = {
  body: Joi.object({
    jobTitle: Joi.string().min(3).max(20).optional().messages(validationMessages("Job Title", 3, 20)),
    jobLocation: Joi.string().valid('onsite', 'remotley', 'hybrid').optional().messages(validationMessages("Job Location", 3, 20)),
    workingTime: Joi.string().valid('part-time', 'full-time').optional().messages(validationMessages("Working Time")),
    experience: Joi.number().min(0).max(30).optional().messages(validationMessages("Experience", 0, 30)),
    jobDescription: Joi.string().min(10).max(1000).optional().messages(validationMessages("Job Description", 10, 1000)),
    technicalSkills: Joi.array().min(1).max(100).optional().messages(validationMessages("Technical Skills", 1, 100)),
    softSkills: Joi.array().min(1).max(50).optional().messages(validationMessages("Soft Skills", 1, 50)),
  }),

  headers: Joi.object({
    ...generalRules.headers
  }).unknown(true),

  params: Joi.object({
    _id: generalRules.objectId
  })
}

export const deleteJob = {
  headers: Joi.object({
    ...generalRules.headers
  }).unknown(true),

  params: Joi.object({
    _id: generalRules.objectId.required().messages(validationMessages("Job ID"))
  })
}

export const allJobs = {
  headers: Joi.object({
    ...generalRules.headers
  }),
}

export const getAllJobsForSpecificCompany = {
  headers: Joi.object({
    ...generalRules.headers
  }).unknown(true),

  query: Joi.object({
    companyName: Joi.string().min(3).max(20).required().messages(validationMessages("Company Name", 3, 20)),
  })
}

export const applyToJob = {
  headers: Joi.object({
    ...generalRules.headers
  }).unknown(true),

  body: Joi.object({
    jobId: generalRules.objectId.required().messages(validationMessages("Job ID", "String")),
  })
}