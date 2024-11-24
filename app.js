const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const { errors } = require("celebrate");
const router = require("./routes");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require('./middlewares/logger');

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
app.use(requestLogger);
app.use(router);
app.use(errorLogger); 
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
