const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, purchaseService, infoService, withdrawService } = require('../services');
const { success, fail, bad } = require('../helpers/requests');
const { Wallet, Withdraw } = require('../models');
const { debitWallet } = require('../utils/transaction');
const { generateReference } = require('../helpers/references');

const createUser = catchAsync(async (req, res) => {

  const role = req.user.role
  if (role !== 'admin' && role !== 'manager' && role !== 'moderator') return bad(res, "You are not authorized for this action")

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
  const role = req.user.role
  if (role !== 'admin' && role !== 'manager' && role !== 'moderator') return bad(res, "You are not authorized for this action")

  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return success(res, "User returned succesfully", user);
});

const getLoggedUser = catchAsync(async (req, res) => {
  const role = req.user.role
  if (role !== 'admin' && role !== 'manager' && role !== 'moderator') return bad(res, "You are not authorized for this action")

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
  const role = req.user.role
  if (role !== 'admin' && role !== 'manager' && role !== 'moderator') return bad(res, "You are not authorized for this action")

  const user = await userService.updateUserById(req.params.userId, req.body);
  return success(res, "Account updated successfully",user);
});

const deleteUser = catchAsync(async (req, res) => {
  const role = req.user.role
  if (role !== 'admin' && role !== 'manager' && role !== 'moderator') return bad(res, "You are not authorized for this action")

  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getPurchases = catchAsync(async (req, res) => {
  const role = req.user.role
  if (role !== 'admin' && role !== 'manager' && role !== 'moderator') return bad(res, "You are not authorized for this action")

  const filter = pick(req.query, ['title', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await purchaseService.queryPurchases(filter, options);
  return success(res, 'Purchases retrieved succesfully',result);
});

const getPurchase = catchAsync(async (req, res) => {
  const role = req.user.role
  if (role !== 'admin' && role !== 'manager' && role !== 'moderator') return bad(res, "You are not authorized for this action")

  const purchases = await purchaseService.getPurchaseById(req.params.purchasesId);
  if (!purchases) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Purchase not found');
  }
  return success(res, 'Purchase retrieved succesfully',purchases);
});

const updatePurchase = catchAsync(async (req, res) => {
  const role = req.user.role
  if (role !== 'admin' && role !== 'manager' && role !== 'moderator') return bad(res, "You are not authorized for this action")

  const purchases = await purchaseService.updatePurchaseById(req.params.purchasesId, req.body);
  res.send(purchases);
});

const deletePurchase = catchAsync(async (req, res) => {
  const role = req.user.role
  if (role !== 'admin' && role !== 'manager' && role !== 'moderator') return bad(res, "You are not authorized for this action")

  await purchaseService.deletePurchaseById(req.params.purchasesId);
  res.status(httpStatus.NO_CONTENT).send();
});

const createPurchase = catchAsync(async (req, res) => {
  const role = req.user.role
  if (role !== 'admin' && role !== 'manager' && role !== 'moderator') return bad(res, "You are not authorized for this action")

  const payload = {

    user: req.user._id,
    ...req.body
  }

  let amount = req.body.amount
  let ref = req.body.ref
  let seller = req.body.seller
  let user = req.user._id
  let title = req.body.title
  let payment_ref = req.body.payment_ref

  const purchases = await purchaseService.createPurchase(payload);

  if (purchases) {
        // create debit transaction
        const transaction = await Transaction.create([{
          user,
          trx_type: 'DEBIT',
          purpose: "Information purchase",
          amount,
          trx_status: 'success',
          summary: `You paid ${amount} for the information "${title}"`,
          trx_summary: `You paid ${amount} for the information "${title}"`,
          trx_ref: ref,
          balance_before: 0,
          balance_after: 0,
          meta: {
            payment_method: "Paystack",
            payment_ref: payment_ref,
            seller: seller,
          }
        }]);

        // create seller sales log

        const sales = await saleService.createSale({
          ...payload,
          user: seller,
          buyer: user,
        });

        if (sales) {
              // create debit transaction
            let salesTrx =  await creditWallet({
                user_id: req.body.seller,
                purpose: "Information sales",
                amount: req.body.amount,
                summary: `You got paid ${amount} for the information "${title}"`,
                trx_summary: `You got paid ${amount} for the information "${title}"`,
                trx_ref: req.body.ref,
                trx_status: 'success',
                meta_data: {
                  payment_method: "Paystack",
                  payment_ref: payment_ref,
                  buyer: req.body.buyer,
                }
              })

              // console.log(salesTrx)
              return success(res, 'Information Purchased succesfully',{purchase: purchases, sales: sales, buyer_trx: transaction, sales_trx: salesTrx.data});

        }

  }
});


const createWithdrawal = catchAsync(async (req, res) => {
  const payload = {
    user: req.user._id,
    ...req.body
  }
  const result = await Withdraw.create(payload);
  return success(res, 'Withdraw request placed succesfully, we will contact you shortly',result);
});


const getWithdrawReq = catchAsync(async (req, res) => {
  const role = req.user.role
  if (role !== 'admin' && role !== 'manager' && role !== 'moderator') return bad(res, "You are not authorized for this action")


  const filter = pick({...req.query}, ['title', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
  const result = await withdrawService.queryWithdraws(filter, options);
  return success(res, 'Withdrawals retrieved succesfully',result);
});

const approveWithdrawReq = catchAsync(async (req, res) => {

  if ( req.user.role !== 'admin') bad(res, 'You must be an administrator to access this resource.')

  try {
    const id = req.params.id
    const {status, approved} = req.body


    Withdraw.findOne({_id: id}).then(d => {
      // console.log(d)
      if(d.status === 'paid') return bad(res, 'This withrawal request has already been paid')
    })


    const updateReq = await withdrawService.updatePurchaseById(id, req.body);

    if (!updateReq) return fail(res, "No such request with the id was found")

    if (status  && status === 'paid') {
   // deduct the user balance
   await debitWallet({
    user_id: updateReq.user,
    amount: updateReq.amount,
    purpose: 'Payout of Withdrawal Request',
    summary: `You withdrew ${updateReq.amount} from your wallet`,
    trx_summary: `You withdrew ${updateReq.amount} from your wallet`,
    trx_ref: `APRK-${generateReference()}`,
    trx_status: 'success',

  })

  return success(res, 'Withdrawal Request marked as paid successfully', updateReq)

    }

    if (approved && updateReq){
      return success(res, 'Withdrawal Request approved successfully', updateReq)
    }

    return success(res, 'Withdrawal Request updated successfully', updateReq)

  } catch (error) {
    console.log(error)
  }
});


const getInfos = catchAsync(async (req, res) => {
  const role = req.user.role
  if (role !== 'admin' && role !== 'manager' && role !== 'moderator') return bad(res, "You are not authorized for this action")

  const filter = pick(req.query, ['title', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
  const result = await infoService.queryInfos(filter, options);
  return success(res, 'Informations retrieved succesfully',result);
});

const getInfo = catchAsync(async (req, res) => {
  const role = req.user.role
  if (role !== 'admin' && role !== 'manager' && role !== 'moderator') return bad(res, "You are not authorized for this action")

  const infos = await infoService.getInfoById(req.params.infosId);
  if (!infos) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Info not found');
  }
  return success(res, 'Information retrieved succesfully',infos);
});

const updateInfo = catchAsync(async (req, res) => {
  const role = req.user.role
  if (role !== 'admin' && role !== 'manager' && role !== 'moderator') return bad(res, "You are not authorized for this action")

  const infos = await infoService.updateInfoById(req.params.id, req.body);
  res.send(infos);
});

const deleteInfo = catchAsync(async (req, res) => {
  const role = req.user.role
  if (role !== 'admin' && role !== 'manager' && role !== 'moderator') return bad(res, "You are not authorized for this action")

  await infoService.deleteInfoById(req.params.id);
  return success(res, 'Info deleted successfully')
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getLoggedUser,
  createPurchase,
  getPurchases,
  getPurchase,
  updatePurchase,
  deletePurchase,
  createWithdrawal,
  getWithdrawReq,
  approveWithdrawReq,
  getInfo,
  getInfos,
  updateInfo,
  deleteInfo
};
