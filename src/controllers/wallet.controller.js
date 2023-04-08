const { success, error, notfound, bad } = require('../helpers/requests');
const Wallet = require('../models/wallet.model')
const Transaction = require('../models/transactions.model');
const pick = require('../utils/pick');


async function getWallet(req, res){
    const user = await req.user._id
if (!user){
  return bad(res, 'User is not logged in')
}
    try {
      // check if user has a wallet
      const userWallet = await Wallet.findOne({user:user})

      // create a new wallet if it doesn't exist
    if(!userWallet) {
      const createWallet = await Wallet.create({
              user,
            });

            return success(res, 'wallet created successfully', createWallet);

    } else {
      console.log(req.user)
      return success(res,'Wallet returned successfully', userWallet);

    }

    } catch (err) {
      console.log(err)
      return error(res, 'Something went wrong')
    }
  };


  async function getTransactions(req, res){
    const user = req.user._id

    if (req.user.role === 'admin') filter =  pick(req.query, ['title', 'user', 'role']);
    if (req.user.role !== 'admin') filter = pick({...req.query, user: user}, ['title', 'user']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    try {
      const uTransactions = await Transaction.paginate(filter, options)
      // const uTransactions = await Transaction.find({user:user}).sort({createdAt: -1})
      if(typeof uTransactions !== 'object'){
       return notfound(res, 'Transaction not found', uTransactions)
      }
      return success(res, 'user transactions returned successfully', uTransactions)
    } catch (err) {
      console.log(err)
      return error(res, 'Something went wrong', err.message)
    }
  }


  module.exports = { getWallet, getTransactions}
