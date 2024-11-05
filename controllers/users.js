const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { statusCodes } = require("../utils/constants");
const User = require("../models/user");

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error.name === "DocumentNotFoundError") {
        res.status(statusCodes.NOT_FOUND).send({ message: error.message });
      } else if (error.name === "CastError") {
        res.status(statusCodes.BAD_REQUEST).send({ message: error.message });
      } else {
        res
          .status(statusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt.hash(password, 10).then((hashedPassword) => {
    User.create({ name, avatar, email, password: hashedPassword })
      .then((user) => {
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        res.status(statusCodes.CREATED).send(userWithoutPassword);
      })
      .catch((error) => {
        if (error.name === "ValidationError") {
          res.status(statusCodes.BAD_REQUEST).send({ message: error.message });
        } else if (error.code === 11000) {
          res
            .status(statusCodes.CONFLICT)
            .send({ message: "User with this email already exists" });
        } else {
          res
            .status(statusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: "An error has occurred on the server" });
        }
      });
  });
};

const updateUserInfo = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        res.status(statusCodes.NOT_FOUND).send({ message: "User not found" });
      }

      res.send(updatedUser);
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        res.status(statusCodes.BAD_REQUEST).send({ message: error.message });
      } else if (error.name === "CastError") {
        res.status(statusCodes.BAD_REQUEST).send({ message: error.message });
      } else {
        res
          .status(statusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.send({ token });
    })
    .catch((error) => {
      if (error.name === "AuthError") {
        res.status(statusCodes.UNAUTHORIZED).send({ message: error.message });
      } else {
        res
          .status(statusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: error.message });
      }
    });
};

module.exports = { getCurrentUser, updateUserInfo, createUser, login };
