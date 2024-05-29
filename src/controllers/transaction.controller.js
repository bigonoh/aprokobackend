// const Transactions = require('../models/transactions');
const mongoose = require('mongoose');
const { generateReference } = require('../helpers/references');
const { success, bad } = require('../helpers/requests');
const User = require('../models/user.model');
const Wallet = require('../models/wallet.model');
const { creditWallet, debitWallet } = require('../utils/transaction');

function formatNaira() {
  const nairaSymbol = '\u{020A6}';
  let sum = 0;
  for (let i = 0; i < arguments.length; i++) {
    sum += arguments[i];
  }
  return nairaSymbol + new Intl.NumberFormat('en-US').format(sum);
}

// topup wallet
async function topupWallet(req, res) {
  const session = await mongoose.startSession();
  // session.startTransaction()

  try {
    const { status, amount, summary, payment_gateway, currency } = req.body;
    const trx_ref = `APRK-${generateReference()}`;
    const user_id = req.user._id;

    if (status === 'success') {
      const creditResult = await creditWallet({
        amount,
        user_id,
        session,
        summary,
        purpose: 'Wallet Topup',
        payment_gateway,
        currency,
        trx_status: 'success',
        trx_ref,
      });
      return success(res, 'Account Succesfully Funded', creditResult);
    }

    if (status === 'failed') {
      return bad(res, 'Transaction failed');
    }
    return bad(res, 'Transaction failed');
  } catch (err) {
    // console.log(err)
    return bad(res, err);
  }
}

// user to user transfer
const transfer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const { to, amount, summary } = req.body;
  const from = req.user._id; // get sender id
  const fromUser = req.user.username; // get sender username

  if (!from) {
    return bad(res, 'Unable to retrieve sender id, try logging out and login in again');
  }

  try {
    // find recieving user by username
    const toUser = await User.findOne({ username: to });
    if (!toUser) {
      return bad(res, 'This user does not exist');
    }

    //  if user doesnt have a wallet create one
    const WalletExists = await Wallet.findOne({ user_id: toUser._id });
    if (!WalletExists) {
      await Wallet.create({ user_id: toUser._id });
      // return success(res, 'User has no wallet so i created a new wallet')
    }

    // prevent self trnsfer
    if (to === fromUser) {
      return bad(res, `You can't transfer to your self`);
    }
    //  console.log('from',from, 'toUser', toUser._id)

    const trx_ref = `APRK-${generateReference()}`;
    if (!to && !from && !amount && !summary) {
      return bad(res, 'Pls fill out all fields');
    }

    const transferResult = await Promise.all([
      debitWallet({
        amount,
        user_id: from,
        trx_status: 'success',
        purpose: 'Transfer',
        trx_ref,
        summary: `You sent ${formatNaira(amount)} to ${to}`,
        trx_summary: `TRFR TO: ${to}. TRX REF:${trx_ref} `,
        session,
      }),
      creditWallet({
        amount,
        trx_status: 'success',
        user_id: toUser._id,
        toUser,
        purpose: 'Transfer',
        trx_ref,
        summary: `${fromUser}, Sent ${formatNaira(amount)} to you `,
        trx_summary: `TRFR FROM: ${fromUser}. TRX REF:${trx_ref} `,
        session,
      }),
    ]);

    const failedTxns = transferResult[0];
    if (failedTxns.status !== true) {
      const errors = failedTxns.message;
      await session.abortTransaction();
      console.log(errors);
      return bad(res, `transaction failed ${errors}`);
    }

    await session.commitTransaction();
    // session.endSession();
    return success(res, 'transfer successfully', transferResult);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err);
    return bad(res, `Unable to perform transfer. Please try again. \n Error: ${err}`);
  }
};

module.exports = { topupWallet, transfer };
