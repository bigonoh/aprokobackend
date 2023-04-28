const httpStatus = require('http-status');
const { Proposal } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a proposal
 * @param {Object} proposalBody
 * @returns {Promise<Proposal>}
 */
const createProposal = async (proposalBody) => {
  // if (await Proposal.isEmailTaken(proposalBody.email)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }
  return Proposal.create(proposalBody);
};

/**
 * Query for proposals
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryProposals = async (filter, options) => {
  const proposals = await Proposal.paginate(filter, options);
  return proposals;
};

/**
 * Get proposal by id
 * @param {ObjectId} id
 * @returns {Promise<Proposal>}
 */
const getProposalById = async (id) => {
  return Proposal.findById(id);
};

/**
 * Get proposal by email
 * @param {string} email
 * @returns {Promise<Proposal>}
 */
const getProposalByEmail = async (email) => {
  return Proposal.findOne({ email });
};

/**
 * Update proposal by id
 * @param {ObjectId} proposalId
 * @param {Object} updateBody
 * @returns {Promise<Proposal>}
 */
const updateProposalById = async (proposalId, updateBody) => {
  const proposal = await getProposalById(proposalId);
  if (!proposal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Proposal not found');
  }
  // if (updateBody.email && (await Proposal.isEmailTaken(updateBody.email, proposalId))) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }
  Object.assign(proposal, updateBody);
  await proposal.save();
  return proposal;
};

/**
 * Delete proposal by id
 * @param {ObjectId} proposalId
 * @returns {Promise<Proposal>}
 */
const deleteProposalById = async (proposalId) => {
  const proposal = await getProposalById(proposalId);
  if (!proposal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Proposal not found');
  }
  await proposal.remove();
  return proposal;
};

module.exports = {
  createProposal,
  queryProposals,
  getProposalById,
  getProposalByEmail,
  updateProposalById,
  deleteProposalById,
};
