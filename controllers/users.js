const { statusCodes } = require("../utils/constants");
const User = require("../models/user");

const getUsers = (_req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
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
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      res.status(statusCodes.CREATED).send(user);
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        res.status(statusCodes.BAD_REQUEST).send({ message: error.message });
      } else {
        res
          .status(statusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

module.exports = { getUsers, getUserById, createUser };
