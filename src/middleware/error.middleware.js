import AppError from "../errors/AppError.js";

const errorHandler = (err, req, res, next) => {

  if (err.name === "ZodError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.issues,
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
    });
  }

  if (err.code === "23505") {
    return res.status(409).json({
      success: false,
      message: "Resource already exists",
    });
  }


  if (err.code === "23503") {
    return res.status(400).json({
      success: false,
      message: "Invalid reference",
    });
  }


  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  console.error(err);
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

export default errorHandler;