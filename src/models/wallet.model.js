const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const walletSchema = mongoose.Schema(
  {
    balance: { type: Number,
      required: true,
      default: 0.00 },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
walletSchema.plugin(toJSON);

/**
 * @typedef Wallet
 */
const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
