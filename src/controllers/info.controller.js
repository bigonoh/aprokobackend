const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { infoService } = require('../services');
const states = require('../utils/state_cities.json');
const { success } = require('../helpers/requests');

const createInfo = catchAsync(async (req, res) => {
  const payload = {
    user: req.user._id,
    ...req.body,
  };
  const infos = await infoService.createInfo(payload);
  return success(res, 'Informations created succesfully', infos);
});

const getInfos = catchAsync(async (req, res) => {
  let filter = [];

  if (req.query.location && req.query.location.length > 2) {
    filter = pick(req.query, ['title', 'role', 'user', 'location']);
  } else {
    filter = pick(req.query, ['title', 'role', 'user']);
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
  const result = await infoService.queryInfos(filter, options);

  return success(res, 'Informations retrieved succesfully', result);
});

const getInfo = catchAsync(async (req, res) => {
  const infos = await infoService.getInfoById(req.params.infosId);
  console.log(infos);
  if (!infos) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Info not found');
  }
  return success(res, 'Information retrieved succesfully', infos);
});

const updateInfo = catchAsync(async (req, res) => {
  const infos = await infoService.updateInfoById(req.params.infosId, req.body);
  res.send(infos);
});

const deleteInfo = catchAsync(async (req, res) => {
  await infoService.deleteInfoById(req.params.infosId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getLocations = catchAsync(async (req, res) => {
  return res.send(states);
});

module.exports = {
  createInfo,
  getInfos,
  getInfo,
  updateInfo,
  deleteInfo,
  getLocations,
};
