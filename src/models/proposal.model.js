const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const proposalSchema = mongoose.Schema(
  {
    ask_info_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Info',
      required: true,
    },

    answered_info_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Info',
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    asker: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },

    answerer: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },

    accepted: {
      type: Boolean,
      default: this.status === 'accepted',
    },

    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'rejected', 'accepted'],
    },
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
