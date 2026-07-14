const validate = (schema, source = "body") => {

  return (req, res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      req.validated = parsed;
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default validate;