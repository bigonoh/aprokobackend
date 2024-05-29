const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { saleService } = require('../services');
const { success } = require('../helpers/requests');
const { creditWallet } = require('../utils/transaction');

const createSale = catchAsync(async (req, res) => {
  const payload = {
    ampunt: req.body.amount,
    ref: req.body.ref,
    seller: req.body.seller,
    user: req.user.body,
    ...req.body,
  };
  const sales = await saleService.createSale(payload);

  if (sales) {
    // create debit transaction
    await creditWallet({
      toUser: user,
      trx_type: 'CREDIT',
      purpose: 'Information sales',
      amount,
      trx_status: 'success',
      summary: `You got paid ${amount} for the information "${title}"`,
      trx_summary: `You got paid ${amount} for the information "${title}"`,
      trx_ref: ref,
      meta_data: {
        payment_method: 'Paystack',
        payment_ref,
        buyer,
      },
    });
    return success(res, 'Sales created succesfully', { sale: sales, trx: transaction });
  }
});

const getSales = catchAsync(async (req, res) => {
  let filter;
  if (req.user.role === 'admin') filter = pick(req.query, ['title', 'user', 'role']);
  if (req.user.role !== 'admin') filter = pick({ ...req.query, user: req.user }, ['title', 'user']);

  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
  const result = await saleService.querySales({ ...filter }, options);
  return success(res, 'Sales retrieved succesfully', result);
});

const getSale = catchAsync(async (req, res) => {
  const sales = await saleService.getSaleById(req.params.salesId);
  if (!sales) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sale not found');
  }
  return success(res, 'Sale retrieved succesfully', sales);
});

const updateSale = catchAsync(async (req, res) => {
  const sales = await saleService.updateSaleById(req.params.salesId, req.body);
  res.send(sales);
});

const deleteSale = catchAsync(async (req, res) => {
  await saleService.deleteSaleById(req.params.salesId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSale,
  getSales,
  getSale,
  updateSale,
  deleteSale,
};
