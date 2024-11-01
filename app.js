const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes");
const { statusCodes } = require("./utils/constants");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to the DB"))
  .catch(console.error);

app.use(express.json());
app.use((req, _res, next) => {
  req.user = {
    _id: "6723007fa426fab4f7398f75",
  };
  next();
});
app.use(router);
app.use((_req, res) => {
  res
    .status(statusCodes.NOT_FOUND)
    .json({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  console.log("Server is running");
});
