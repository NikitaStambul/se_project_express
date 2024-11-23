const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { statusCodes } = require("../utils/constants");
const User = require("../models/user");
const {
  NotFoundError,
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} = require("../utils/errors");

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error.name === "DocumentNotFoundError") {
        next(new NotFoundError(`User with id: ${req.user._id} not found`));
      } else if (error.name === "CastError") {
        next(new BadRequestError("Wrong userId format"));
      } else {
        next(error);
      }
    });
};

const createUser = (req, res, next) => {
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
          next(new BadRequestError("Data is not valid"));
        } else if (error.code === 11000) {
          next(new ConflictError("User with this email already exists"));
        } else {
          next(error);
        }
      });
  });
};

const updateUserInfo = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        next(new NotFoundError(`User with id: ${req.user._id} not found`));

        return;
      }

      res.send(updatedUser);
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        next(new BadRequestError("Data is not valid"));
      } else if (error.name === "CastError") {
        next(new BadRequestError("Wrong userId format"));
      } else {
        next(error);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new BadRequestError("Email or password are not provided"));

    return;
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.send({ token });
    })
    .catch((error) => {
      if (error.name === "CredentialsError") {
        next(new UnauthorizedError("Email or password are incorrect"));
      } else {
        next(error);
      }
    });
};

module.exports = { getCurrentUser, updateUserInfo, createUser, login };
