const httpStatus = require('http-status');
const { Info } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a info
 * @param {Object} infoBody
 * @returns {Promise<Info>}
 */
const createInfo = async (infoBody) => {
  // if (await Info.isEmailTaken(infoBody.email)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }
  return Info.create(infoBody);
};

/**
 * Query for infos
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryInfos = async (filter, options) => {
  const infos = await Info.paginate(filter, options);
  return infos;
};

/**
 * Get info by id
 * @param {ObjectId} id
 * @returns {Promise<Info>}
 */
const getInfoById = async (id) => {
  return Info.findById(id);
};

/**
 * Get info by email
 * @param {string} email
 * @returns {Promise<Info>}
 */
const getInfoByEmail = async (email) => {
  return Info.findOne({ email });
};

/**
 * Update info by id
 * @param {ObjectId} infoId
 * @param {Object} updateBody
 * @returns {Promise<Info>}
 */
const updateInfoById = async (infoId, updateBody) => {
  const info = await getInfoById(infoId);
  if (!info) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Info not found');
  }
  // if (updateBody.email && (await Info.isEmailTaken(updateBody.email, infoId))) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }
  Object.assign(info, updateBody);
  await info.save();
  return info;
};

/**
 * Delete info by id
 * @param {ObjectId} infoId
 * @returns {Promise<Info>}
 */
const deleteInfoById = async (infoId) => {
  const info = await getInfoById(infoId);
  if (!info) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Info not found');
  }
  await info.remove();
  return info;
};

module.exports = {
  createInfo,
  queryInfos,
  getInfoById,
  getInfoByEmail,
  updateInfoById,
  deleteInfoById,
};
