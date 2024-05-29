const mongoose = require('mongoose');
const paginate = require('./plugins/paginate.plugin');
const toJSON = require('./plugins/toJSON.plugin');

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    trx_type: {
      type: String,
      required: true,
      enum: ['CREDIT', 'DEBIT'],
    },
    trx_ref: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0.0,
    },
    wallet_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wallet',
    },
    balance_before: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: ['NGN', 'USD', 'EUR', 'GBP'],
    },
    balance_after: {
      type: Number,
      required: true,
    },
    summary: { type: String },
    trx_summary: { type: String },

    payment_gateway: {
      type: String,
      // required: [true, "payment gateway is required"],
      enum: ['flutterwave'], // Payment gateway might differs as the application grows
    },
    trx_status: {
      type: String,
      enum: ['success', 'pending', 'failed'],
      default: 'pending',
    },

    meta: {
      type: Object,
    },
    created_at: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamp: true }
);

// add plugin that converts mongoose to json
transactionSchema.plugin(toJSON);
transactionSchema.plugin(paginate);

/**
 * @typedef
 */

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
