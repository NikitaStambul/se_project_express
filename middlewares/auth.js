const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { statusCodes } = require("../utils/constants");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    res
      .status(statusCodes.UNAUTHORIZED)
      .send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;

    next();
  } catch (err) {
    res
      .status(statusCodes.UNAUTHORIZED)
      .send({ message: "Invalid or expired token" });
  }
};

module.exports = auth;
