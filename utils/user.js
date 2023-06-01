const bcrypt = require("bcrypt");

const User = require("../models/User");

const userAlreadyExists = async (email) => User.findOne({ email });

const hashPassword = async (password) => bcrypt.hash(password, 10);

const verifyPassword = async (userPassword, enteredPassword) =>
  bcrypt.compare(enteredPassword, userPassword);

module.exports = { userAlreadyExists, hashPassword, verifyPassword };
