import User from "../../../DB/Models/user.model.js";
import { compareSync, hashSync } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ErrorHandlerClass } from "../../Utils/error-class.utils.js";
import { nanoid } from "nanoid";
import { sendEmailService } from "../../Services/sendEmail.service.js";

export const register = async (req, res, next) => {
  const { firstName, lastName, email, recoveryEmail, password, DOB, phone, role } = req.body;

  // Check User's data uniqness

  const userExists = await User.findOne({ $or: [{ email }, { phone }] });

  if (userExists) {
    return next(new ErrorHandlerClass("user already exists", 409));
  }

  const hashedPassword = hashSync(password, +(process.env.SALT_NUMBER));

  const userName = firstName + " " + lastName;

  const customId = nanoid(6);

  const userData = {
    firstName,
    lastName,
    email,
    recoveryEmail,
    password: hashedPassword,
    DOB,
    phone,
    role,
    userName,
    customId
  }

  const newUser = await new User(userData).save();

  delete userData.password;

  return res.status(201).json({ message: "user added", user: userData })
}

export const login = async (req, res, next) => {

  const { email, password, phone } = req.body;

  const userExists = await User.findOne({ $or: [{ email }, { phone }] });

  if (!userExists) {
    return next(new ErrorHandlerClass("Invalid Credentials", 404))
  }

  const checkPassword = compareSync(password, userExists.password);

  if (!checkPassword) {
    return next(new ErrorHandlerClass("Invalid Credentials", 400))
  }

  const token = jwt.sign({ id: userExists._id }, process.env.TOKEN_SIGNATURE)
  const updateUserStatus = await User.updateOne({ _id: userExists._id }, { status: true });
  return res.status(200).json({ message: "Logged in Successfully", token });
}

export const updateUser = async (req, res, next) => {
  const { firstName, lastName, email, phone, recoveryEmail, DOB } = req.body;
  let userName;
  const user = req.user;

  if (firstName && lastName) {
    userName = firstName + " " + lastName;
  } else if (firstName) {
    userName = firstName + " " + user.lastName;
  } else if (lastName) {
    userName = user.firstName + " " + lastName;
  }

  if (email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return next(new ErrorHandlerClass("Email already in use", 409));
    }
  }

  if (phone) {
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return next(new ErrorHandlerClass("Phone number already in use", 409));
    }
  }

  if (recoveryEmail) {
    const recoveryEmailExists = await User.findOne({ recoveryEmail });
    if (recoveryEmailExists) {
      return next(new ErrorHandlerClass("Recovery Email already in use", 409));
    }
  }

  const updatedUserData = {
    firstName: firstName ? firstName : user.firstName,
    lastName: lastName ? lastName : user.lastName,
    email: email ? email : user.email,
    phone: phone ? phone : user.phone,
    recoveryEmail: recoveryEmail ? recoveryEmail : user.recoveryEmail,
    DOB: DOB ? DOB : user.DOB,
    userName: userName ? userName : user.userName
  }


  const updatedUser = await User.updateOne({ _id: user._id }, updatedUserData);

  return res.status(200).json({ message: "done", data: updatedUserData });


}

export const deleteUser = async (req, res, next) => {
  const { user } = req;
  const deleteUser = await User.deleteOne({ _id: user._id });

  if (!deleteUser.deletedCount) {
    return next(new ErrorHandlerClass("Account not deleted", 404))
  }

  return res.status(200).json({ message: "done" })

}

export const profileData = async (req, res, next) => {
  const { user } = req;

  return res.status(200).json({ message: "done", data: user })
}

export const getSpecificUser = async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findOne({ _id: userId }).select('-password -phone');

  if (!user) {
    return next(new ErrorHandlerClass("user not exists", 404));
  }

  return res.status(200).json({ message: "done", data: user });
}

export const getRecoveryEmails = async (req, res, next) => {
  const { recoveryEmail } = req.body;
  const users = await User.find({ recoveryEmail }).select('-password -phone');

  if (users.length == 0) {
    return next(new ErrorHandlerClass("no users exists", 404))
  }

  return res.status(200).json({ message: "done", data: users });
}

export const updatePassword = async (req, res, next) => {
  const { user } = req;
  let { oldPassword, newPassword } = req.body;


  const userPassword = await User.findById({ _id: user._id }).select('password');


  if (!userPassword) {
    return next(new ErrorHandlerClass("user not exists", 404));
  }

  const checkPassword = compareSync(oldPassword, userPassword.password);


  if (!checkPassword) {
    return next(new ErrorHandlerClass("Invalid Password", 400))
  }

  newPassword = hashSync(newPassword, +(process.env.SALT_NUMBER))

  const updatePassword = await User.updateOne({ _id: user._id }, { password: newPassword });

  return res.status(200).json({ message: "Password updated" })

}

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;


  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandlerClass("user not exists", 404))
  }

  const otp = nanoid(6);

  const hashedOtp = hashSync(otp, +(process.env.SALT_NUMBER));

  const token = jwt.sign({ email, hashedOtp }, process.env.TOKEN_SIGNATURE, { expiresIn: '5m' })

  const emailForOtp = await sendEmailService({
    to: user.email,
    subject: "Reset Your Password",
    otp
  })

  if (emailForOtp.rejected.length) {
    return next(new ErrorHandlerClass("Otp email has not been sent", 500))
  }

  user.otp = otp;
  await user.save();

  return res.status(201).json({ message: `Otp has been sent on your email : ${email}`, token })

}

export const checkOtp = async (req, res, next) => {
  const { otp, otpToken } = req.body;

  const decodedToken = jwt.verify(otpToken, process.env.TOKEN_SIGNATURE);

  const checkOtp = compareSync(otp, decodedToken.hashedOtp);

  if (!checkOtp) {
    return next(new ErrorHandlerClass("Invalid or Expired Token", 400));
  }

  const user = await User.findOne({ email: decodedToken.email });

  if (!user) {
    return next(new ErrorHandlerClass("user not exists", 404));
  }

  const token = jwt.sign({ id: user._id }, process.env.TOKEN_SIGNATURE);

  return res.status(200).json({ message: "done", token });

}

export const resetPassword = async (req, res, next) => {
  const { newPassword } = req.body;
  const { user } = req;
  const hashedPassword = hashSync(newPassword, +(process.env.SALT_NUMBER));

  const updatePassword = await User.updateOne({ _id: user._id }, { password: hashedPassword });

  return res.status(200).json({ message: "Password has been changed" })
}