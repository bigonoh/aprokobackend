const httpStatus = require('http-status');
const { generateReference } =  require('../helpers/references');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const Withdraw = require('../models/withdraw.model')
const { success, bad, fail } = require('../helpers/requests');
const { withdrawService } = require('../services');
const { debitWallet } = require('../utils/transaction');

const createWithdrawal = catchAsync(async (req, res) => {
  const payload = {
    user: req.user._id,
    ...req.body
  }
  const result = await Withdraw.create(payload);
  return success(res, 'Withdraw request placed succesfully, we will contact you shortly',result);
});


const getWithdrawReq = catchAsync(async (req, res) => {

  if ( req.user.role !== 'admin') bad(res, 'You must be an administrator to access this resource.')
  const filter = pick({...req.query}, ['title', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await withdrawService.queryWithdraws(filter, options);
  return success(res, 'Withdrawals retrieved succesfully',result);
});

const approveWithdrawReq = catchAsync(async (req, res) => {

  if ( req.user.role !== 'admin') bad(res, 'You must be an administrator to access this resource.')

  try {
    const id = req.params.id || req.query.id
    const status = req.body.status

    Withdraw.findOne({_id: id}).then(d => {
      if(d.status === 'paid') return bad(res, 'This request has already been approved', 200)
    })

    const updateReq = await withdrawService.updatePurchaseById(id, {...status ? {status: status} : {status: 'paid'}});

    if (!updateReq) return fail(res, "No such reques t with the id was found")

    // deduct the user balance
    await debitWallet({
      user_id: updateReq.user,
      amount: updateReq.amount,
      purpose: 'Approved Withdrawal Request',
      summary: `You withdrew ${updateReq.amount} from your wallet`,
      trx_summary: `You withdrew ${updateReq.amount} from your wallet`,
      trx_ref: `APRK-${generateReference()}`,
      trx_status: 'success',

    })

    return success(res, 'Request updated successfully', updateReq)

  } catch (error) {
    console.log(error)
  }
});


// const updateInfo = catchAsync(async (req, res) => {
//   const infos = await infoService.updateInfoById(req.params.infosId, req.body);
//   res.send(infos);
// });

// const deleteInfo = catchAsync(async (req, res) => {
//   await infoService.deleteInfoById(req.params.infosId);
//   res.status(httpStatus.NO_CONTENT).send();
// });


module.exports = {
  createWithdrawal,
  getWithdrawReq,
  approveWithdrawReq
};
