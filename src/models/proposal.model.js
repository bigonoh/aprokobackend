const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const proposalSchema = mongoose.Schema(
  {
    info_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Info',
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    buyer: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },

    seller: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },

    accepted: {
      type: Boolean,
      default: false,
    }

  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
proposalSchema.plugin(toJSON);
proposalSchema.plugin(paginate);
/**
 * @typedef Proposal
 */
const Proposal = mongoose.model('Proposal', proposalSchema);

module.exports = Proposal;
