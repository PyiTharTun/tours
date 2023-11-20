const AppError = require("../utils/appError");

module.exports = (err, req, res, next) => {
  console.log("______")
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  console.log(">>>>>");
  const sendErrorDev = (err, res) => {
    console.log("Dev Error");
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      err: err,
      errorStack: err.stack,
    });
  };

  const sendErrorProd = (err, res) => {
    console.log("Prod Error");
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  };

  if (process.env.NODE_ENV == "development") {

    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV == "production") {
    if (err.name == "JsonWebTokenError" || err.name == "TokenExpiredError") {
      err = new AppError(
        `${err.message.toUpperCase()}. Please login again`,
        401
      );
    }
    sendErrorProd(err, res);
  }
};