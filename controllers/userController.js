require("dotenv").config();
const jwt = require("jsonwebtoken");

const {
  ERROR_MESSAGES,
  PASSWORD_RESET_COOLDOWN_TIME,
} = require("../constants/Errors");
const {
  userAlreadyExists,
  hashPassword,
  verifyPassword,
} = require("../utils/user");

const User = require("../models/User");
const { generateToken, validateJWT } = require("../utils/helpers");
const { sendMail } = require("../utils/sendMail");

const register = async (req, res, next) => {
  try {
    const { username, password, email } = req.body.data;

    if (!email.trim() || !username.trim()) {
      res.status(400);
      throw new Error(ERROR_MESSAGES.EMAIL_REQUIRED);
    }

    if (await userAlreadyExists(email)) {
      res.status(400);
      throw new Error(ERROR_MESSAGES.USER_ALREADY_EXISTS);
    }

    if (!password || password.length < 8) {
      res.status(400);
      throw new Error(ERROR_MESSAGES.MIN_PASSWORD_LENGTH);
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    const { password: userPassword, ...rest } = await savedUser._doc;

    res.status(200).json({
      message: "User registered successfully",
      user: rest,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body.data;

    if (!email.trim() || !password.trim()) {
      res.status(400);
      throw new Error("Email and Password are required.");
    }

    const registeredUser = await User.findOne({ email });

    if (!registeredUser) {
      res.status(401);
      throw new Error(ERROR_MESSAGES.INVALID_USERNAME_PASSWORD);
    }

    const isPasswordAuthentic = await verifyPassword(
      registeredUser.password,
      password
    );

    if (!isPasswordAuthentic) {
      res.status(401);
      throw new Error(ERROR_MESSAGES.INVALID_USERNAME_PASSWORD);
    }

    res
      .status(200)
      .json({ message: "login success", status: 200, user: registeredUser });
  } catch (error) {
    next(error);
  }
};

async function GenerateTokenAndUpdateUser(email) {
  const resetPasswordToken = await generateToken({
    email,
  });

  await User.findOneAndUpdate(
    { email },
    {
      $set: { resetPasswordToken },
    }
  );
  return resetPasswordToken;
}

function getEmailData(email, passwordResetLink) {
  return {
    subject: "Password Reset Link",
    content: `
                  <h1>Password Reset link</h1>
                  <p>below is the password reset link for the account ${email}</p>
                  </br>
                  <strong>Note: </strong>
                  <p>This link will get expired in ${PASSWORD_RESET_COOLDOWN_TIME} mins</p>
      
                  <p>click</p> <a href='${passwordResetLink}' target='_blank'>here</a>
                `,
  };
}

const generateResetPasswordLink = async (req, res, next) => {
  const { email } = req.body.data;
  if (!email.trim()) {
    res.status(400);
    throw new Error(ERROR_MESSAGES.EMAIL_REQUIRED);
  }

  try {
    const currentUser = await User.findOne({ email });

    if (!currentUser) {
      res.status(401);
      throw new Error("Invalid Request.");
    }

    const currentResetPasswordToken = currentUser.resetPasswordToken;
    validateJWT(currentResetPasswordToken);

    const resetPasswordToken = await GenerateTokenAndUpdateUser(email);

    const passwordResetLink = `http://localhost:4000/api/auth/reset-pwd?token=${resetPasswordToken}`;
    const emailData = getEmailData(email, passwordResetLink);

    sendMail(emailData, { email });

    return res.status(200).json({
      message: "Password reset link sent successfully",
      status: 200,
      token: resetPasswordToken,
    });
  } catch (error) {
    const errorMessage = error.message;

    if (errorMessage === "jwt expired") {
      const resetPasswordToken = await GenerateTokenAndUpdateUser(email);
      const passwordResetLink = `http://localhost:4000/api/auth/reset-pwd?token=${resetPasswordToken}`;
      const emailData = getEmailData(email, passwordResetLink);

      sendMail(emailData, { email });

      return res.status(200).json({
        message: "Password reset link sent successfully",
        status: 200,
        token: resetPasswordToken,
      });
    }
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  const token = req.query.token || null;
  const { password, confirmPassword } = req.body.data;

  try {
    if (!token.trim()) {
      res.status(401);
      throw new Error("Invalid Request!");
    }

    if (!password || !confirmPassword) {
      res.status(400);
      throw new Error("Invalid Request!");
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    const currentUser = await User.findOne({ email: verifyToken.email });

    if (!currentUser) {
      res.status(400);
      throw new Error("Invalid Request!");
    }

    if (currentUser.resetPasswordToken === null) {
      res.status(400);
      throw new Error("Password already changed");
    }

    if (password.trim() !== confirmPassword.trim()) {
      res.status(400);
      throw new Error("passwords are not matching!");
    }

    const isPasswordSame = await verifyPassword(currentUser.password, password);
    if (isPasswordSame) {
      res.status(400);
      throw new Error("New password cannot be same as old password.");
    }

    const hashedPassword = await hashPassword(password);

    await User.findOneAndUpdate(
      { email: verifyToken.email },
      {
        $set: { password: hashedPassword, resetPasswordToken: null },
      }
    );

    res.status(200).json({
      message: "Password reset done successfully.",
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, generateResetPasswordLink, resetPassword };
