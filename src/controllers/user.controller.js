const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const { success } = require('../helpers/requests');
const { Wallet } = require('../models');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  return success(res, "Account Created Succesfully",user);
});

const getUsers = catchAsync(async (req, res) => {
  // console.log(req.user, 'req.user');

  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  return success(res, "Users returned successfully",result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return success(res, "User returned succesfully", user);
});

const getLoggedUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  let wallet = await Wallet.findOne({user})

  //create wallet if user has no wallet
  if(!wallet) wallet = await Wallet.create({user})

  // console.log(wallet);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
   return success(res, "User returned succesfully", {user, wallet});
});


const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  return success(res, "Account updated successfully",user);
});

const updateSingleUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.user._id, req.body);
  return success(res, "Account updated successfully",user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getLoggedUser,
  updateSingleUser
};
