const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { tokenTypes } = require('../config/tokens');
const paginate = require('./plugins/paginate.plugin');

const withdrawSchema = mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },

    approved: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ['pending', 'processing', 'paid', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
withdrawSchema.plugin(toJSON);
withdrawSchema.plugin(paginate);

/**
 * @typedef Withdraw
 */
const Withdraw = mongoose.model('Withdraw', withdrawSchema);

module.exports = Withdraw;
