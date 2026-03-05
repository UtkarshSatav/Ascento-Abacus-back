function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const status = error.status || 500;
  const payload = {
    message: error.message || 'Internal Server Error'
  };

  if (error.details) {
    payload.details = error.details;
  }

  return res.status(status).json(payload);
}

module.exports = errorHandler;
