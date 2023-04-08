const httpStatus = require('http-status');
const { Purchase } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a purchase
 * @param {Object} purchaseBody
 * @returns {Promise<Purchase>}
 */
const createPurchase = async (purchaseBody) => {
  // if (await Purchase.isEmailTaken(purchaseBody.email)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }
  return Purchase.create(purchaseBody);
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
const queryPurchases = async (filter, options) => {
  const data = await Purchase.paginate(filter, options);
  return data;
};

/**
 * Get purchase by id
 * @param {ObjectId} id
 * @returns {Promise<Purchase>}
 */
const getPurchaseById = async (id) => {
  return Purchase.findById(id);
};

/**
 * Get purchase by email
 * @param {string} ref
 * @returns {Promise<Purchase>}
 */
const getPurchaseByRef = async (ref) => {
  return Purchase.findOne({ ref });
};

/**
 * Update purchase by id
 * @param {ObjectId} purchaseId
 * @param {Object} updateBody
 * @returns {Promise<Purchase>}
 */
const updatePurchaseById = async (purchaseId, updateBody) => {
  const purchase = await getPurchaseById(purchaseId);
  if (!purchase) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Purchase not found');
  }
  // if (updateBody.email && (await Purchase.isEmailTaken(updateBody.email, purchaseId))) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }
  Object.assign(purchase, updateBody);
  await purchase.save();
  return purchase;
};

/**
 * Delete purchase by id
 * @param {ObjectId} purchaseId
 * @returns {Promise<Purchase>}
 */
const deletePurchaseById = async (purchaseId) => {
  const purchase = await getPurchaseById(purchaseId);
  if (!purchase) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Purchase not found');
  }
  await purchase.remove();
  return purchase;
};

module.exports = {
  createPurchase,
  queryPurchases,
  getPurchaseById,
  getPurchaseByRef,
  updatePurchaseById,
  deletePurchaseById,
};
