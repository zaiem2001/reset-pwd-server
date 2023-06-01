PASSWORD_RESET_COOLDOWN_TIME = 2;

ERROR_MESSAGES = {
  USER_ALREADY_EXISTS: "User already Exists",
  MIN_PASSWORD_LENGTH: "Password length should be 8 characters",
  EMAIL_REQUIRED: "Email is required.",
  INVALID_USERNAME_PASSWORD: "Invalid Username or Password",
  PASSWORD_LINK_ALREADY_SENT: `Password reset link already sent, wait for ${PASSWORD_RESET_COOLDOWN_TIME} mins to receive a new link.`,
};

module.exports = {
  ERROR_MESSAGES,
  PASSWORD_RESET_COOLDOWN_TIME,
};
