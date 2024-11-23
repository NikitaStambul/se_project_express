const router = require("express").Router();
const usersRouter = require('./users');
const itemsRouter = require('./cothingItems');
const { login, createUser } = require("../controllers/users");
const { statusCodes } = require("../utils/constants");
const { validateUserCreation, validateLogin } = require("../middlewares/validation");

router.use('/users', usersRouter)
router.use('/items', itemsRouter)
router.post('/signin', validateLogin, login);
router.post('/signup', validateUserCreation, createUser);

router.use((_req, res) => {
  res
    .status(statusCodes.NOT_FOUND)
    .json({ message: "Requested resource not found" });
});

module.exports = router;