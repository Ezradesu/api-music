export const notFound = (req, res) => {
  res.status(404).json({ status: 'fail', message: 'Resource not found' });
};

export const errorHandler = (err, req, res, next) => {
  if (err.isJoi || err.statusCode === 400) {
    return res
      .status(400)
      .json({ status: 'fail', message: err.message || 'Bad Request' });
  }


  if (err.statusCode && err.statusCode >= 400 && err.statusCode < 500) {
    return res
      .status(err.statusCode)
      .json({ status: 'fail', message: err.message || 'Client Error' });
  }


  console.error(err);
  res.status(500).json({ status: 'error', message: 'Internal Server Error' });
};
