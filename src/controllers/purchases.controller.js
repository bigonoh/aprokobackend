const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { purchaseService, saleService } = require('../services');
const states = require('../utils/state_cities.json');
const { success } = require('../helpers/requests');
const Transaction = require('../models/transactions.model');
const Purchase = require('../models/purchase.model');
const { creditWallet } = require('../utils/transaction');

const createPurchase = catchAsync(async (req, res) => {
  const payload = {
    user: req.user._id,
    ...req.body,
  };

  let amount = req.body.amount;
  let ref = req.body.ref;
  let seller = req.body.seller;
  let user = req.user._id;
  let title = req.body.title;
  let payment_ref = req.body.payment_ref;

  const purchases = await purchaseService.createPurchase(payload);
  const exists = Purchase.exists({ info_id: req.body.info_id });

  if (exists) {
    return success(res, 'You already have a purchase of this information');
  }

  if (purchases) {
    // create debit transaction
    const transaction = await Transaction.create([
      {
        user,
        trx_type: 'DEBIT',
        purpose: 'Information purchase',
        amount,
        trx_status: 'success',
        summary: `You paid ${amount} for the information "${title}"`,
        trx_summary: `You paid ${amount} for the information "${title}"`,
        trx_ref: ref,
        balance_before: 0,
        balance_after: 0,
        meta: {
          payment_method: 'Paystack',
          payment_ref: payment_ref,
          seller: seller,
        },
      },
    ]);

    // create seller sales log

    const sales = await saleService.createSale({
      ...payload,
      user: seller,
      buyer: user,
    });

    if (sales) {
      // create debit transaction
      let salesTrx = await creditWallet({
        user_id: req.body.seller,
        purpose: 'Information sales',
        amount: req.body.amount,
        summary: `You got paid ${amount} for the information "${title}"`,
        trx_summary: `You got paid ${amount} for the information "${title}"`,
        trx_ref: req.body.ref,
        trx_status: 'success',
        meta_data: {
          payment_method: 'Paystack',
          payment_ref: payment_ref,
          buyer: req.body.buyer,
        },
      });

      // console.log(salesTrx)
      return success(res, 'Information Purchased succesfully', {
        purchase: purchases,
        sales: sales,
        buyer_trx: transaction,
        sales_trx: salesTrx.data,
      });
    }
  }
});

const getPurchases = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await purchaseService.queryPurchases(filter, options);
  return success(res, 'Purchases retrieved succesfully', result);
});

// these are the infos the user has bought
const getBoughtInfos = catchAsync(async (req, res) => {
  const filter = pick({ user: req.user._id }, ['title', 'role', 'user']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
  const result = await purchaseService.queryPurchases(filter, options);
  console.log(req.filter);

  return success(res, "Info's retrieved succesfully", result);
});

const getPurchase = catchAsync(async (req, res) => {
  const purchases = await purchaseService.getPurchaseById(req.params.purchasesId);
  if (!purchases) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Purchase not found');
  }
  return success(res, 'Purchase retrieved succesfully', purchases);
});

const updatePurchase = catchAsync(async (req, res) => {
  const purchases = await purchaseService.updatePurchaseById(req.params.purchasesId, req.body);
  res.send(purchases);
});

const deletePurchase = catchAsync(async (req, res) => {
  await purchaseService.deletePurchaseById(req.params.purchasesId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getLocations = catchAsync(async (req, res) => {
  return res.send(states);
});

module.exports = {
  createPurchase,
  getPurchases,
  getPurchase,
  updatePurchase,
  deletePurchase,
  getLocations,
  getBoughtInfos,
};
