const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { tokenTypes } = require('../config/tokens');

const saleSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    buyer: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },

    info_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Info',
      required: true,
    },

    information: {
      type: String,
      required: true,
    },

    reported: {
      type: Boolean,
      default: false,
      enum: [true, false],
    },

    report_reason: {
      type: String,
      required: this.reported
    },

    created_at: {
      type: Date,
      default: Date.now()
    }

  },

  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
saleSchema.plugin(toJSON);
saleSchema.plugin(paginate);
/**
 * @typedef Token
 */
const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;
