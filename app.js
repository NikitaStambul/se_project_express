const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const router = require("./routes");
const helmet = require("helmet");

require("dotenv").config();

const app = express();
const {
  PORT = 3001,
  DATABASE_URL = "mongodb://127.0.0.1:27017/wtwr_db",
  HOST = "localhost",
} = process.env;

mongoose
  .connect(DATABASE_URL)
  .then(() => console.log("Connected to the DB"))
  .catch(console.error);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
