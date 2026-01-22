import { ErrorHandlerClass } from "../Utils/error-class.utils.js"


export const errorHandle = (API) => {
  return (req, res, next) => {
    API(req, res, next).catch((error) => {
      next(new ErrorHandlerClass("Internal Server Error", 500, error.stack, "Error Handle Middleware"))
    })
  }
}

export const globalResponse = (error, req, res, next) => {
  if (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
      error: error.data,
      stack: error.stack
    })
  }
}