const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin'),
  }),
};
const createUserValidation = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
  }),
};
const verifyCompanyUserValidation = {
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
    token: Joi.string().required(),
  }),
};
const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      // email: Joi.string().email(),
      password: Joi.string().custom(password),
      previousPassword: Joi.string().custom(password),
      address: Joi.string(),
      phoneNumber: Joi.string(),
      firstName: Joi.string(),
      lastName: Joi.string(),
    })
    .min(1),
};

const updateUserFields = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      address: Joi.string(),
      phoneNumber: Joi.string(),
      firstName: Joi.string(),
      lastName: Joi.string(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserFields,
  verifyCompanyUserValidation,
  createUserValidation
};
