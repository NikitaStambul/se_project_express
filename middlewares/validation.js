const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateClothingItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
      "any.required": 'The "name" field is required',
    }),
    weather: Joi.string().valid("cold", "warm", "hot").required().messages({
      "string.only":
        'The "weather" field must be one of "cold", "warm", or "hot"',
      "string.empty": 'The "weather" field must be filled in',
      "any.required": 'The "weather" field is required',
    }),
    imageUrl: Joi.string()
      .custom((value, helpers) => {
        if (!validator.isURL(value)) {
          return helpers.error("string.uri");
        }
        return value;
      })
      .required()
      .messages({
        "string.empty": 'The "imageUrl" field must be filled in',
        "string.uri": 'the "imageUrl" field must be a valid url',
        "any.required": 'The "imageUrl" field is required',
      }),
  }),
});

const validateUserCreation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
      "any.required": 'The "name" field is required',
    }),
    avatar: Joi.string()
      .custom((value, helpers) => {
        if (!validator.isURL(value)) {
          return helpers.error("string.uri");
        }
        return value;
      })
      .required()
      .messages({
        "string.empty": 'The "avatar" field must be filled in',
        "string.uri": 'the "avatar" field must be a valid url',
        "any.required": 'The "avatar" field is required',
      }),
    email: Joi.string().email().required().messages({
      "string.email": 'The "email" field must be a valid email address',
      "string.empty": 'The "email" field must be filled in',
      "any.required": 'The "email" field is required',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
      "any.required": 'The "password" field is required',
    }),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.email": 'The "email" field must be a valid email address',
      "string.empty": 'The "email" field must be filled in',
      "any.required": 'The "email" field is required',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
      "any.required": 'The "password" field is required',
    }),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required().messages({
      "string.hex": 'The "id" field must be a valid hexadecimal string',
      "string.length": 'The "id" field must be exactly 24 characters long',
      "string.empty": 'The "id" field must be filled in',
      "any.required": 'The "id" parameter is required',
    }),
  }),
});

module.exports = {
  validateClothingItem,
  validateUserCreation,
  validateLogin,
  validateId,
};
