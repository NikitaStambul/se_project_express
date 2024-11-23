const errorHandler = (err, _req, res, next) => {
  console.error(err);

  const { statusCode = 500, message = "Something went wrong" } = err;
  const isProduction = process.env.NODE_ENV === "production";

  res.status(statusCode).send({
    message:
      isProduction && statusCode === 500
        ? "An error occurred on the server"
        : message,
    ...(isProduction ? {} : { error: err.stack }),
  });

  next(); // if something unintentional happens
};

module.exports = errorHandler;
