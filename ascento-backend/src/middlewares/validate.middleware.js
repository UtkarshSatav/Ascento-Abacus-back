function validate(schema, source = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      return next({
        status: 422,
        message: 'Validation failed',
        details: error.details.map((item) => item.message)
      });
    }

    req[source] = value;
    return next();
  };
}

module.exports = validate;
