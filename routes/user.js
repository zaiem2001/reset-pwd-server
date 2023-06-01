const router = require("express").Router();

const {
  register,
  login,
  generateResetPasswordLink,
  resetPassword,
} = require("../controllers/userController");

router.post("/register", register);
router.post("/login", login);

router.post("/gen-reset-pwd", generateResetPasswordLink);
router.post("/reset-pwd", resetPassword);

module.exports = router;
