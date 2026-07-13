import AppError from "../errors/AppError.js";

const validate = (schema, source = "body") => {
  return (req, res, next) => {
    try {
      req[source] = schema.parse(req[source]);
      next();
    } catch (err) {
      next(
        new AppError(
          err.issues?.[0]?.message || "Validation failed",
          400
        )
      );
    }
  };
};

export default validate;