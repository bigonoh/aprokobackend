const Wallet = require('../models/wallet.model');
const Transaction = require('../models/transactions.model');
const User = require('../models/user.model');
// credit wallet

async function creditWallet ({ session, user_id, amount, summary, toUser, purpose, trx_ref, currency, trx_summary, payment_method, meta, trx_status}) {

        const userWallet = await Wallet.findOne({user:user_id});

        if (!userWallet) {
            return {
                status: false,
                statusCode:404,
                message: `User Wallet not found`
              }
        };

        // console.log(userWallet)

        // topup and update wallet balance if trx is successful
        if (trx_status === 'success'){

        const updatedWallet = await Wallet.findOneAndUpdate({user:user_id}, { $inc: { balance: amount } }, {session});

        let ifUser = purpose == "Transfer" ? toUser._id : user_id
        // console.log('tiff',ifUser)
        // create credit transaction
        const transaction = await Transaction.create([{
                    user : ifUser,
                    trx_type: 'CREDIT',
                    purpose,
                    trx_status: 'success',
                    amount,
                    currency,
                    trx_summary,
                    summary,
                    trx_ref,
                    balance_before: Number(userWallet.balance),
                    balance_after: Number(userWallet.balance) + Number(amount),
                    meta,
                  }], {session});

          return {
            status: true,
            statusCode:201,
            message: 'Credit successful',
            data: {updatedWallet, transaction}
          }
        }
    }

        async function debitWallet({ user_id, amount, purpose, trx_ref, summary,status, trx_summary,payment_method, session}) {

            // find user wallet
                const userWallet = await Wallet.findOne({user:user_id});
                let user = await User.findOne({_id:user_id})
                let username = user.email
                if (!userWallet) {
                    return {
                        status: false,
                        statusCode:404,
                        message: `User ${username} doesn\'t exist`
                      }
                };

                // check if user has sufficient funds in wallet
                if (Number(userWallet.balance) < amount) {
                    return {
                        status: false,
                        statusCode:400,
                        message: `User ${username} has insufficient balance`
                      }
                  }

                // update wallet balance
                const updatedWallet = await Wallet.findOneAndUpdate({user:user_id}, { $inc: { balance: - amount } }, {session});


                // create debit transaction
                const transaction = await Transaction.create([{
                    user,
                    trx_type: 'DEBIT',
                    purpose,
                    amount,
                    trx_status: status,
                    summary,
                    trx_summary,
                    trx_ref,
                    balance_before: Number(userWallet.balance),
                    balance_after: Number(userWallet.balance) - Number(amount),
                  }], {session});

                  return {
                    status: true,
                    statusCode:201,
                    message: 'Debit was successful',
                    data: {updatedWallet, transaction}
                  }
                }


module.exports = {creditWallet, debitWallet}
