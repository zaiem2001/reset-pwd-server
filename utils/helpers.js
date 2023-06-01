const jwt = require("jsonwebtoken");
const {
  ERROR_MESSAGES,
  PASSWORD_RESET_COOLDOWN_TIME,
} = require("../constants/Errors");
require("dotenv").config();

const generateToken = async (payload) => {
  const JWT_SECRET = process.env.JWT_SECRET_TOKEN;
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: `${PASSWORD_RESET_COOLDOWN_TIME}m`,
  });
};

const validateJWT = (currentResetPasswordToken) => {
  if (currentResetPasswordToken) {
    const verifyToken = jwt.verify(
      currentResetPasswordToken,
      process.env.JWT_SECRET_TOKEN
    );

    if (verifyToken?.email) {
      throw new Error(ERROR_MESSAGES.PASSWORD_LINK_ALREADY_SENT);
    }
    return verifyToken;
  }

  return true;
};

module.exports = { generateToken, validateJWT };
