const httpStatus = require('http-status');
const { Sale } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a sale
 * @param {Object} saleBody
 * @returns {Promise<Sale>}
 */
const createSale = async (saleBody) => {
  // if (await Sale.isEmailTaken(saleBody.email)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }
  return Sale.create(saleBody);
};

/**
 * Query for data
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySales = async (filter, options) => {
  const data = await Sale.paginate(filter, options);
  return data;
};

/**
 * Get sale by id
 * @param {ObjectId} id
 * @returns {Promise<Sale>}
 */
const getSaleById = async (id) => {
  return Sale.findById(id);
};

/**
 * Get sale by email
 * @param {string} ref
 * @returns {Promise<Sale>}
 */
const getSaleByRef = async (ref) => {
  return Sale.findOne({ ref });
};

/**
 * Update sale by id
 * @param {ObjectId} saleId
 * @param {Object} updateBody
 * @returns {Promise<Sale>}
 */
const updateSaleById = async (saleId, updateBody) => {
  const sale = await getSaleById(saleId);
  if (!sale) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sale not found');
  }
  // if (updateBody.email && (await Sale.isEmailTaken(updateBody.email, saleId))) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }
  Object.assign(sale, updateBody);
  await sale.save();
  return sale;
};

/**
 * Delete sale by id
 * @param {ObjectId} saleId
 * @returns {Promise<Sale>}
 */
const deleteSaleById = async (saleId) => {
  const sale = await getSaleById(saleId);
  if (!sale) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sale not found');
  }
  await sale.remove();
  return sale;
};

module.exports = {
  createSale,
  querySales,
  getSaleById,
  getSaleByRef,
  updateSaleById,
  deleteSaleById,
};
