const {internalServerError, invalidUserError} = require("../utils/utils");
const secret = 'mysecretsshhh';
const User = require('../models/User');
const jwt = require("jsonwebtoken");

const authenticate = (req, res) => {
  const {email, user, password} = req.body;
  user.isCorrectPassword(password, function (err, same) {
    if (err) {
      internalServerError(res, "Password mis-matched");
    } else if (!same) {
      invalidUserError(res);
    } else {
      const payload = {email};
      const token = jwt.sign(payload, secret, {
        expiresIn: '1h'
      });
      res.status(200).cookie('token', token, {httpOnly: true}).json({name: user.name});
    }
  });
};

const extractUserDetails = (request, response, next) => {
  const email = request.email || request.body.email;
  User.findOne({email}, function (err, user) {
    if (err) {
      internalServerError(response);
    } else if (!user) {
      invalidUserError(response);
    } else {
      request.body.user = user;
      next();
    }
  });
};

const logout = function (req, res) {
  res.clearCookie("token");
  return res.sendStatus(200);
};

module.exports = {logout, authenticate, extractUserDetails};

