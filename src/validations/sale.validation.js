const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createSale = {
  body: Joi.object().keys({
    // user: Joi.custom(objectId).required(),
    amount: Joi.number().required(),
    buyer: Joi.custom(objectId).required(),
    info_id: Joi.custom(objectId).required(),
    information: Joi.string().required(),
    ref: Joi.string().required(),
    payment_ref: Joi.string().required(),
    reported: Joi.boolean(),
    report_reason: Joi.string(),
    title: Joi.string().required(),
  }),
};

const getSales = {
  query: Joi.object().keys({
    id: Joi.string(),
    // role: Joi.string(),
    sortBy: Joi.string(),
    populate: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getSale = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updateSale = {
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

const deleteSale = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createSale,
  getSale,
  getSales,
  updateSale,
  deleteSale,
};
