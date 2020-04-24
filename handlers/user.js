const {internalServerError, invalidUserError} = require("../utils/utils");
const secret = 'mysecretsshhh';
const User = require('../models/User');
const jwt = require("jsonwebtoken");

const authenticate = (req, res) => {
  const {email, password} = req.body;
  User.findOne({email}, function (err, user) {
    if (err) {
      internalServerError(res, "Unable to find user");
    } else if (!user) {
      invalidUserError(res);
    } else {
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
    }
  });
};

const logout = function (req, res) {
  res.clearCookie("token");
  return res.sendStatus(200);
};

module.exports = {logout, authenticate};

