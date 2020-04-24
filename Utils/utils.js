const logger = function (req, res, next) {
  console.log("URL:", req.url);
  console.log("Method:", req.method);
  console.log("Body:", req.body);
  console.log("Cookie:", req.cookies);
  console.log("-------------------------------------------------------------");
  next();
};

const invalidUserError = (res) => {
  res.status(401)
    .json({
      error: 'User validation failed'
    });
};

const internalServerError = (res, message = "") => {
  res.status(500)
    .json({
      error: `Internal error please try again : ${message}`
    });
};

module.exports = {logger, internalServerError, invalidUserError};