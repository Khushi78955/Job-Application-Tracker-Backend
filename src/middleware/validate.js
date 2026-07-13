import AppError from "../errors/AppError.js";

const validate = (schema) => {
    return (req, res, next) => {
        try{
            req.body = schema.parse(req.body);
            next();
        } catch(err){
            next(new AppError(err.issues?.[0]?.message || "Validation failed", 400))
        }
    }
}

export default validate;