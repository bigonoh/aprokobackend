const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { proposalService } = require('../services');
const states = require('../utils/state_cities.json');
const { success } = require('../helpers/requests');

const createProposal = catchAsync(async (req, res) => {
  const payload = {
    seller: req.user._id,
    ...req.body
  }
  const proposals = await proposalService.createProposal(payload);
  return success(res, 'Proposal sent succesfully',proposals);
});

const getProposals = catchAsync(async (req, res) => {
  // console.log(req.proposals, 'req.proposals');

  const filter = pick(req.query, ['title', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
  const result = await proposalService.queryProposals(filter, options);
  return success(res, 'Proposals retrieved succesfully',result);
});

const getProposal = catchAsync(async (req, res) => {
  const proposals = await proposalService.getProposalById(req.params.proposalsId);
  if (!proposals) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Proposal not found');
  }
  return success(res, 'Proposal retrieved succesfully',proposals);
});

const updateProposal = catchAsync(async (req, res) => {
  const proposals = await proposalService.updateProposalById(req.params.proposalsId, req.body);
  res.send(proposals);
});

const deleteProposal = catchAsync(async (req, res) => {
  await proposalService.deleteProposalById(req.params.proposalsId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getLocations = catchAsync(async (req, res) => { return res.send(states) })

module.exports = {
  createProposal,
  getProposals,
  getProposal,
  updateProposal,
  deleteProposal,
  getLocations,
};
