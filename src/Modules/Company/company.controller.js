import Company from "../../../DB/Models/company.model.js";
import { ApiFeatures } from "../../Utils/api-features.utils.js";
import { ErrorHandlerClass } from "../../Utils/error-class.utils.js";

export const addCompany = async (req, res, next) => {
  const { companyName, description, industry, address, numOfEmployees, companyEmail } = req.body;
  const { user } = req;

  const companyExists = await Company.findOne({ $or: [ { companyName }, { companyEmail } ] });

  if (companyExists) {
    return next(new ErrorHandlerClass("Company name or email already exists", 409));
  }

  const companyInfo = {
    companyName,
    description,
    industry,
    address,
    numOfEmployees,
    companyEmail,
    company_hr: user._id
  }

  const newCompany = await new Company(companyInfo).save();

  return res.status(201).json({ message: "Company was added successfully", data: newCompany });

}

export const updateCompany = async (req, res, next) => {

  const { id } = req.params;
  const { user } = req;

  const company = await Company.findOne({ _id: id, company_hr: user._id });

  if (!company) {
    return next(new ErrorHandlerClass("Company not exists", 404));
  }

  const { companyName, description, industry, address, numOfEmployees, companyEmail } = req.body;

  if (companyName) {
    const nameExists = await Company.findOne({ companyName });
    if (nameExists) {
      return next(new ErrorHandlerClass("Company name already exists", 409));
    }
    company.companyName = companyName;
  }
  if (description) company.description = description;
  if (industry) company.industry = industry;
  if (address) company.address = address;
  if (numOfEmployees) company.numOfEmployees = numOfEmployees;
  if (companyEmail) {
    const emailExists = await Company.findOne({ companyEmail });
    if (emailExists) {
      return next(new ErrorHandlerClass("Company email already exists", 409));
    }
    company.companyEmail = companyEmail;
  }

  await company.save();

  return res.status(200).json({ message: "Company updated successfully", data: company });

}

export const deleteCompany = async (req, res, next) => {
  const { id } = req.params;
  const { user } = req;

  const deleteCompany = await Company.findOneAndDelete({ _id: id, company_hr: user._id });

  if (!deleteCompany) {
    return next(new ErrorHandlerClass("Company not exists", 404))
  }

  res.status(200).json({ message: "Company has been deleted" });

}

export const getCompanyData = async (req, res, next) => {
  const { id } = req.params;

  const companyData = await Company.findById(id);

  if (!companyData) {
    return next(new ErrorHandlerClass("Company not exists", 404))
  }

  res.status(200).json({ message: "done", data: companyData });

}

export const getAllCompanies = async (req, res, next) => {
  const ApiFeaturesInstance = new ApiFeatures(Company.find(), req.query).filter().fields().sort().pagination().search();

  const total = await ApiFeaturesInstance.getCount();
  const companies = await ApiFeaturesInstance.mongooseQuery;
  // console.log(companies);
  
  const page = ApiFeaturesInstance.pageNumber;

  if (companies.length === 0) {
    return res.status(200).json({ message: "No companies exists", total, data: [] });
  }

  res.status(200).json({ message: "done", page, total, data: companies });

}