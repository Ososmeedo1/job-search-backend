import { DateTime } from "luxon";
import Application from "../../../DB/Models/application.model.js";
import Company from "../../../DB/Models/company.model.js";
import Job from "../../../DB/Models/job.model.js";
import { ApiFeatures } from "../../Utils/api-features.utils.js";
import { ErrorHandlerClass } from "../../Utils/error-class.utils.js";
import fs from 'fs';
import { nanoid } from "nanoid";
import { uploadFile } from "../../Utils/imagekit.utils.js";


export const addJob = async (req, res, next) => {

  const { companyId } = req.params;
  const { user } = req;

  const company = await Company.findById({ _id: companyId });

  if (!company) {
    return next(new ErrorHandlerClass("Company doesn't exist", 404, "job controller"));
  }

  const { jobTitle, jobLocation, workingTime, experience, jobDescription, technicalSkills, softSkills } = req.body;

  const jobInfo = {
    jobTitle,
    jobLocation,
    workingTime,
    experience,
    jobDescription,
    technicalSkills,
    softSkills: softSkills ? softSkills : null,
    addedBy: user._id,
    company: companyId
  }

  const newJob = await new Job(jobInfo).save();

  if (!newJob) {
    return next(new ErrorHandlerClass("Something wrong happend", 500, "job controller", "failed to add job"));
  }

  return res.status(201).json({ message: "job has been added", data: newJob });
}

export const updateJob = async (req, res, next) => {
  const { jobTitle, jobLocation, workingTime, experience, jobDescription, technicalSkills, softSkills } = req.body;
  const { _id } = req.params;

  const job = await Job.findById(_id);

  if (!job) {
    return next(new ErrorHandlerClass("Job doesn't exit", 404, "job controller"));
  }

  if (jobTitle) job.jobTitle = jobTitle;
  if (jobLocation) job.jobLocation = jobLocation;
  if (workingTime) job.workingTime = workingTime;
  if (experience) job.experience = experience;
  if (jobDescription) job.jobDescription = jobDescription;
  if (technicalSkills) job.technicalSkills = technicalSkills;
  if (softSkills) job.softSkills = softSkills;

  await job.save();

  return res.status(200).json({ message: "Job updated successfully", data: job });

}

export const deleteJob = async (req, res, next) => {
  const { _id } = req.params;

  const searchJob = await Job.findByIdAndDelete(_id);

  if (!searchJob) {
    return next(new ErrorHandlerClass("Job does not exist", 404))
  }

  return res.status(200).json({ message: "job was deleted successfully" });

}

export const getAllJobs = async (req, res, next) => {

  const ApiFeaturesInstance = new ApiFeatures(Job.find(), req.query, "addedBy", "company").filter().fields().sort().pagination().search();

  const allJobs = await ApiFeaturesInstance.mongooseQuery;

  const total = await ApiFeaturesInstance.getCount();

  const page = ApiFeaturesInstance.pageNumber;

  if (!allJobs.length) {
    return res.status(200).json({ message: "No jobs exists", total, data: [] });
  }

  return res.status(200).json({ message: "done", total, page, data: allJobs });
}

export const getAllJobsForSpecificCompany = async (req, res, next) => {
  const { companyName } = req.query;
  const company = await Company.findOne({ companyName });
  if (!company) {
    return next(new ErrorHandlerClass("Company does not exist", 404));
  }

  const getJobs = await Job.find({ company: company._id });

  if (!getJobs.length) {
    return res.status(200).json({ message: "No jobs exists for this company", data: [] });
  }

  return res.status(200).json({ message: "done", data: getJobs });
}

export const applyToJob = async (req, res, next) => {
  const { jobId } = req.body;
  const { user } = req;

  const job = await Job.findById(jobId);

  if (!job) {
    return next(new ErrorHandlerClass("Job does not exist", 404));
  }

  const isAppExist = await Application.findOne({ userId: user._id, jobId });

  if (isAppExist) {
    return next(new ErrorHandlerClass("You have already apllied for this job", 400))
  }

  if (!req.file) {
    return next(new ErrorHandlerClass("Resume file is required", 400, "job controller"));
  }

  const { url, filePath, fileId } = await uploadFile(
    {
      file: fs.readFileSync(req.file.path),
      folder: `${process.env.GENERAL_FOLDER}/Resumes/${user.customId}`,
      fileName: DateTime.now().toFormat("yyyy-MM-dd") + "__" + nanoid(4) + "__" + req.file.originalname
    }
  );

  const applicationInfo = {
    jobId,
    userId: user._id,
    userResume: {
      URLs: {
        fileUrl: url,
        filePath,
        fileId
      }
    }
  }

  const newApplication = await new Application(applicationInfo).save();

  res.status(201).json({ message: "You have applied successfully", data: newApplication });


}

export const getAllApplicationsForSpecificJob = async (req, res, next) => {
  const { _id } = req.params;

  const job = await Job.findById(_id);

  if (!job) {
    return next(new ErrorHandlerClass("Job does not exist", 404));
  }

  const applications = await Application.find({ jobId: _id }).populate('userId', '-password');

  const applicationsCount = applications.length;

  if (!applications.length) {
    return res.status(200).json({ message: "No applications exists for this job", data: [] });
  }

  return res.status(200).json({ message: "done", total: applicationsCount, data: applications });
}