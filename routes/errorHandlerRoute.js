const notFoundError = (_req, _res, next) => {
  const error = new Error("Resource Not Found");
  error.status = 404;
  next(error);
};
const errorHandler = (error, _req, res) => {
    console.log(error)
  if (error.status) {
    return res
      .status(error.status)
      .send({ status: error.status, message: error.message });
  }
  res.status(500).send({ message: "Internal server error" });
};
module.exports = {
  notFoundError,
  errorHandler,
};
