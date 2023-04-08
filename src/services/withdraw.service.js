const httpStatus = require('http-status');
const { Withdraw } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a withdraw
 * @param {Object} purchaseBody
 * @returns {Promise<Withdraw>}
 */
const createPurchase = async (purchaseBody) => {
  // if (await Withdraw.isEmailTaken(purchaseBody.email)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }
  return Withdraw.create(purchaseBody);
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
const queryWithdraws = async (filter, options) => {
  const data = await Withdraw.paginate(filter, options);
  return data;
};

/**
 * Get withdraw by id
 * @param {ObjectId} id
 * @returns {Promise<Withdraw>}
 */
const getPurchaseById = async (id) => {
  return Withdraw.findById(id);
};

/**
 * Get withdraw by email
 * @param {string} ref
 * @returns {Promise<Withdraw>}
 */
const getPurchaseByRef = async (ref) => {
  return Withdraw.findOne({ ref });
};

/**
 * Update withdraw by id
 * @param {ObjectId} purchaseId
 * @param {Object} updateBody
 * @returns {Promise<Withdraw>}
 */
const updatePurchaseById = async (purchaseId, updateBody) => {
  const withdraw = await getPurchaseById(purchaseId);
  if (!withdraw) {
    throw new ApiError(httpStatus.OK, 'Withdraw not found');
  }
  // if (updateBody.email && (await Withdraw.isEmailTaken(updateBody.email, purchaseId))) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }
  Object.assign(withdraw, updateBody);
  await withdraw.save();
  return withdraw;
};

/**
 * Delete withdraw by id
 * @param {ObjectId} purchaseId
 * @returns {Promise<Withdraw>}
 */
const deletePurchaseById = async (purchaseId) => {
  const withdraw = await getPurchaseById(purchaseId);
  if (!withdraw) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Withdraw not found');
  }
  await withdraw.remove();
  return withdraw;
};

module.exports = {
  createPurchase,
  queryWithdraws,
  getPurchaseById,
  getPurchaseByRef,
  updatePurchaseById,
  deletePurchaseById,
};
