const Joi = require('joi');
const { password, objectId, status } = require('./custom.validation');

const createInfo = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    probation: Joi.boolean(),
    location: Joi.object()
      .keys({
        city: Joi.string().required(),
        state: Joi.string().required(),
      })
      .required(),
    status: Joi.string().required(),
    price: Joi.number().required(),
    selling: Joi.boolean(),
  }),
};

const getInfos = {
  query: Joi.object().keys({
    id: Joi.string(),
    // role: Joi.string(),
    user: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    populate: Joi.string(),
  }),
};

const getInfo = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updateInfo = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
      id: Joi.custom(objectId),
      description: Joi.string(),
      verified: Joi.boolean(),
    })
    .min(1),
};

const deleteInfo = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createInfo,
  getInfo,
  getInfos,
  updateInfo,
  deleteInfo,
};
