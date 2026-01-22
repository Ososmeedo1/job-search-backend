import { Router } from "express";
import * as userController from './user.controller.js';
import * as userValidation from './user.schema.js'
import { auth } from "../../Middlewares/auth.middleware.js";
import { validationMiddleware } from "../../Middlewares/validation.middleware.js";
import { errorHandle } from "../../Middlewares/error-handle.middleware.js";



const router  = Router();

router.post('/register', validationMiddleware(userValidation.addUser) , errorHandle(userController.register));
router.post('/login', validationMiddleware(userValidation.login), errorHandle(userController.login));
router.put('/update', auth(['User', 'Company_HR']), validationMiddleware(userValidation.updateUser), errorHandle(userController.updateUser));
router.delete('/delete', auth(['User', 'Company_HR']), validationMiddleware(userValidation.userAccount), errorHandle(userController.deleteUser));
router.get('/profile', auth(['User', 'Company_HR']), validationMiddleware(userValidation.userAccount), errorHandle(userController.profileData));
router.get('/user/:userId', auth(['User', 'Company_HR']), validationMiddleware(userValidation.getSpecificUser), errorHandle(userController.getSpecificUser));
router.get('/emails', auth(['User', 'Company_HR']), validationMiddleware(userValidation.getRecoveryEmails), errorHandle(userController.getRecoveryEmails));
router.put('/changepassword', auth(['User', 'Company_HR']), validationMiddleware(userValidation.updatePassword), errorHandle(userController.updatePassword))
router.post('/forgotpassword', validationMiddleware(userValidation.forgetPassword), errorHandle(userController.forgotPassword))
router.post('/checkotp', validationMiddleware(userValidation.checkOtp), errorHandle(userController.checkOtp))
router.patch('/resetpassword', auth(['User', 'Company_HR']), validationMiddleware(userValidation.resetPassword), errorHandle(userController.resetPassword))
router.get('/accounts', auth(['User', 'Company_HR']), validationMiddleware(userValidation.getRecoveryEmails), errorHandle(userController.getRecoveryEmailAccounts))

//

export default router;