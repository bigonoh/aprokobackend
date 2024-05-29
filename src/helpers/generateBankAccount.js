const axios = require('axios');
const Account = require('../models/accountModel.js');
const User = require('../models/users-model.js');
const Wallet = require('../models/walletModel.js');

async function generateNGNBankAccount(data) {
  const accountApi = 'https://integrations.getravenbank.com/v1/pwbt/generate_account';

  const user = await User.find(data);

  const accountData = {
    first_name: user.fname,
    last_name: user.lname,
    phone: user.phone,
    amount: '100',
    email: user.email,
  };

  const config = {
    method: 'post',
    url: accountApi,
    headers,
    data: accountData,
  };

  let hasBankAccount = await Account.find(user);

  // if the user does not have a account field initialize one
  if (!hasBankAccount) {
    await Wallet.create(user);
    hasBankAccount = await Account.find(user);
  }

  if (hasBankAccount.ngn_account_no !== null) {
    return fail(res, `User already has a bank account, ${hasBankAccount.ngn_account_no}`);
  }

  try {
    const response = await axios(config);

    if (response.data.status !== 'success') {
      return res.json(response.data);
    }

    if (response.data.status === 'success') {
      await Account.findOneAndUpdate(user, {
        ngn_account_no: response.data.data.account_number,
        ngn_account_name: response.data.data.account_name,
        ngn_bank: response.data.data.bank,
      });

      return true;
    }
  } catch (error) {
    return false;
  }
}

module.exports = { generateNGNBankAccount };
