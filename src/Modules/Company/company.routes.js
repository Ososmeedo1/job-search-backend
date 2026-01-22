import { Router } from "express";
import * as companyController from './company.controller.js'
import * as companyValidation from './company.schema.js'
import { auth } from "../../Middlewares/auth.middleware.js";
import { validationMiddleware } from "../../Middlewares/validation.middleware.js";
import { errorHandle } from "../../Middlewares/error-handle.middleware.js";


const router = Router();

router.post('/add', auth('Company_HR'), validationMiddleware(companyValidation.addCompany), errorHandle(companyController.addCompany));
router.put('/update/:id', auth('Company_HR'), validationMiddleware(companyValidation.updateCompany), errorHandle(companyController.updateCompany));
router.delete('/delete/:id', auth('Company_HR'), validationMiddleware(companyValidation.companyIdParam), errorHandle(companyController.deleteCompany));
router.get('/:id', auth(['Company_HR', 'User']), validationMiddleware(companyValidation.companyIdParam), errorHandle(companyController.getCompanyData));
router.get('/', auth(['Company_HR', 'User']), validationMiddleware(companyValidation.getAllCompanies), errorHandle(companyController.getAllCompanies));

export default router;