const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { proposalService , purchaseService, saleService} = require('../services');
const states = require('../utils/state_cities.json');
const { success, fail } = require('../helpers/requests');
const { Proposal } = require('../models');
const { generateReference } = require('../helpers/references');
const { creditWallet, debitWallet } = require('../utils/transaction');
const Transaction = require('../models/transactions.model');


const createProposal = catchAsync(async (req, res) => {

  const {message, answered_info_id, ask_info_id, asker} = req.body;

  console.log(req.body, 'req body');
  if(!message){
    return fail(res, 'message is required');
  } else if(!answered_info_id){
    return fail(res, 'answered_info_id is required');
  } else if(!ask_info_id){
    return fail(res, 'ask_info_id is required');
  } else if(!asker) {
    return fail(res, 'asker is required');
  }

  const payload = {
    answerer: req.user._id,
    asker: asker,
    message: message,
    answered_info_id: answered_info_id,
    ask_info_id: ask_info_id,
  };
  const proposals = await proposalService.createProposal(payload);
  return success(res, 'Proposal sent succesfully', proposals);
});

const getProposals = catchAsync(async (req, res) => {
  // console.log(req.proposals, 'req.proposals');

  const filter = pick(req.query, ['title', 'role', 'answerer', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
  const result = await proposalService.queryProposals(filter, options);
  // console.log(result, 'proposals');

  return success(res, 'Proposals retrieved succesfully', result);
});

const getProposal = catchAsync(async (req, res) => {
  const proposals = await proposalService.getProposalById(req.params.proposalsId);
  if (!proposals) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Proposal not found');
  }
  return success(res, 'Proposal retrieved succesfully', proposals);
});

const updateProposal = catchAsync(async (req, res) => {
  const proposals = await proposalService.updateProposalById(req.params.proposalsId, req.body);
  res.send(proposals);
});

const acceptRejectProposal = catchAsync(async (req, res) => {
  let {status, proposal_id} = req.body
  try {

  const ref = generateReference();

  if(!proposal_id){
    return fail(res, 'Proposal id is required')
  }

  if(!status){
    return fail(res, 'status field is required');
  }

  if (status !== 'accepted' && status !== 'rejected'){
    return fail(res, 'Invalid status: ' + status);
  }


  const dProposal = await Proposal.findOne({ _id: proposal_id }).populate('answered_info_id')
  .populate('ask_info_id');
    if(typeof dProposal !== 'object'){
      return fail(res, 'No proposal found with the given id')
    }


  if (dProposal) {
    // create debit transaction
    const transaction = {
        user: dProposal.asker._id,
        trx_type: 'DEBIT',
        purpose: 'Information purchase',
        amount: dProposal.answered_info_id.price,
        trx_status: 'success',
        summary: `You paid ${dProposal.answered_info_id.price} for the information "${dProposal.answered_info_id.title}"`,
        trx_summary: `You paid ${dProposal.answered_info_id.price} for the information "${dProposal.answered_info_id.title}"`,
        trx_ref: ref,
        balance_before: 0,
        balance_after: 0,
        meta: {
          payment_method: 'Wallet',
          payment_ref: ref,
          seller: dProposal.answerer,
        },
      }

    // create seller sales log

    const sales = await saleService.createSale({
      info_id: dProposal.answered_info_id._id,
      information: JSON.stringify(dProposal.answered_info_id),
      user: dProposal.answerer._id,
      amount: dProposal.answered_info_id.price,
      buyer: dProposal.asker._id,
    });

    console.log(sales, 'the sales')

    if (sales) {
      // create debit transaction

      let dt = await debitWallet({...transaction, user_id: transaction.user})

      console.log(dt, 'the debit')
      if (dt){

        await Transaction.create(transaction)
         await creditWallet({
          user_id: dProposal.answerer._id,
          purpose: 'Information sales',
          amount: dProposal.answered_info_id.price,
          summary: `You got paid ${dProposal.answered_info_id.price} for the information "${dProposal.answered_info_id.title}"`,
          trx_summary: `You got paid ${dProposal.answered_info_id.price} for the information "${dProposal.answered_info_id.title}"`,
          trx_ref: ref,
          trx_status: 'success',
          meta_data: {
            payment_method: 'Wallet',
            payment_ref: ref,
            buyer: dProposal.asker,
          },
        }).then(d => console.log(d, 'credit trx'));


      } else {
        return fail(res, 'We were unable to debit your wallet')
      }

    }
  }


    const proposals = await proposalService.updateProposalById(dProposal.id, {status: status, accepted: status === 'accepted' ? true: false });

    return success(res, status === 'accepted' ? 'Proposal Accepted successfully' : 'Proposal rejected succesfully', proposals);

  } catch (error) {
    console.error("AcceptRejectProposal: "  + error);
    return fail(res, error.message)

  }

});


const deleteProposal = catchAsync(async (req, res) => {
  console.log(req.params.proposalId, 'proposal id')
  await proposalService.deleteProposalById(req.params.proposalId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getLocations = catchAsync(async (req, res) => {
  return res.send(states);
});

module.exports = {
  createProposal,
  getProposals,
  getProposal,
  updateProposal,
  deleteProposal,
  getLocations,
  acceptRejectProposal
};
