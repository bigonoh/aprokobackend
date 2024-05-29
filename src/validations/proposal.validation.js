const Joi = require('joi');
const { password, objectId, status } = require('./custom.validation');

const createInfo = {
  body: Joi.object().keys({
    info_id: Joi.string().custom(objectId).required(),
    message: Joi.string().required(),
    buyer: Joi.string().custom(objectId).required(),
    seller: Joi.string().custom(objectId).required(),
  }),
};

const getInfos = {
  query: Joi.object().keys({
    id: Joi.string(),
    // role: Joi.string(),
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
      accepted: Joi.boolean(),
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
