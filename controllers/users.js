const { statusCodes } = require("../utils/constants");
const User = require("../models/user");

const getUsers = (_req, res) => {
  User.find({})
    .then((users) => {
      res.status(statusCodes.OK).send(users);
    })
    .catch(() => {
      res
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: "Error retrieving users" });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(statusCodes.OK).send(user);
    })
    .catch((error) => {
      if (error.name === "DocumentNotFoundError") {
        return res
          .status(statusCodes.BAD_REQUEST)
          .send({ message: error.message });
      }

      return res
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: error.message });
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
        return res
          .status(statusCodes.BAD_REQUEST)
          .send({ message: error.message });
      }
      return res
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: error.message });
    });
};

module.exports = { getUsers, getUserById, createUser };
