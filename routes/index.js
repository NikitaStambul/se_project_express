const router = require("express").Router();
const usersRouter = require('./users');
const itemsRouter = require('./cothingItems');
const { login, createUser } = require("../controllers/users");
const { validateUserCreation, validateLogin } = require("../middlewares/validation");
const NotFoundError = require("../utils/errors/notFoundError");

router.use('/users', usersRouter)
router.use('/items', itemsRouter)
router.post('/signin', validateLogin, login);
router.post('/signup', validateUserCreation, createUser);

router.use((_req, _res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;