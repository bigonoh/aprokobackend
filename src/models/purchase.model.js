const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const purchaseSchema = mongoose.Schema(
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

    seller: {
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
purchaseSchema.plugin(toJSON);
purchaseSchema.plugin(paginate);
/**
 * @typedef Token
 */
const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;
