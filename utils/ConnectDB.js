const mongoose = require("mongoose");
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/resetpassword";

const connectDB = () => mongoose.connect(MONGO_URI);

module.exports = {
  connectDB,
};
