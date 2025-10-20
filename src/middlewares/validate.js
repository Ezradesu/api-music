export const validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
  });
  if (error) {
    const message = error.details.map((d) => d.message).join(", ");
    const err = new Error(message);
    err.statusCode = 400;
    return next(err);
  }
  req.validated = value;
  return next();
};

export const validateParams = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.params, {
    abortEarly: false,
    allowUnknown: false,
  });
  if (error) {
    const message = error.details.map((d) => d.message).join(", ");
    const err = new Error(message);
    err.statusCode = 400;
    return next(err);
  }
  req.validated = value;
  return next();
};
