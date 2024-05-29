const express = require('express');
const { transfer, topupWallet } = require('../../controllers/transaction.controller');
const { getTransactions, getWallet } = require('../../controllers/wallet.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

// get user wallet
router.route('/wallet').get(auth(), getWallet);

router.route('/wallet-topup').post(auth(), topupWallet);

router.route('/transfer').post(auth(), transfer);

router.route('/transaction').get(auth(), getTransactions);

// router
//   .route('/')
//   .post(auth('manageUsers'), validate(userValidation.createUser), userController.createUser)
//   .get(auth(), validate(userValidation.getUsers), userController.getUsers);

module.exports = router;
