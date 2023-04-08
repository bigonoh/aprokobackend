const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const depositSchema = mongoose.Schema(
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
      default: 'pending'
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
depositSchema.plugin(toJSON);

/**
 * @typedef Withdraw
 */
const Withdraw = mongoose.model('Withdraw', depositSchema);

module.exports = Withdraw;
