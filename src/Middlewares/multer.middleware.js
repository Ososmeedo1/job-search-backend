import multer from "multer"
import { ErrorHandlerClass } from "../Utils/error-class.utils.js";



export const filteration = {
  file: ["application/pdf", "application/msword"],
  image: ["image/jpeg", "image/png", "image/jpg"]
}

export const multerMiddleware = (filter) => {
  const storage = multer.diskStorage({});

  const fileFilter = (req, file, cb) => {
    if (filter.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ErrorHandlerClass("Invalid file format", 400), false)
    }
  }

  const upload = multer({ storage, fileFilter });
  return upload;
}