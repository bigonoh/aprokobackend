const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createPurchase = {
  body: Joi.object().keys({
    // user: Joi.custom(objectId).required(),
    amount: Joi.number().required(),
    seller: Joi.custom(objectId).required(),
    info_id: Joi.custom(objectId).required(),
    information: Joi.string().required(),
    ref: Joi.string().required(),
    payment_ref: Joi.string().required(),
    reported: Joi.boolean(),
    report_reason: Joi.string(),
    title: Joi.string().required(),
  }),
};

const getPurchases = {
  query: Joi.object().keys({
    id: Joi.string(),
    // role: Joi.string(),
    sortBy: Joi.string(),
    populate: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getPurchase = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updatePurchase = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
      description: Joi.string(),
    })
    .min(1),
};

const deletePurchase = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createPurchase,
  getPurchase,
  getPurchases,
  updatePurchase,
  deletePurchase,
};
