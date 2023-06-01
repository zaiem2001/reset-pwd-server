const express = require("express");
const { connectDB } = require("./utils/ConnectDB");
require("dotenv").config();
const cors = require("cors");

const userRoutes = require("./routes/user");
const { notFound, errorHandler } = require("./middlewares/ErrorMiddleware");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ allowedHeaders: "*" }));

app.use(express.json());
connectDB()
  .then(() => console.log("DB connected successfully."))
  .catch((err) => {
    throw new Error(err);
  });

app.use("/api/auth", userRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server is running on PORT", PORT);
});
