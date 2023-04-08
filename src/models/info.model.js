const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { tokenTypes } = require('../config/tokens');

const infoSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
    probation: {
      type: Boolean,
      default: false,
      enum: [true, false]
    },

    status: {
      type: String,
      enum: ['public', 'private', 'draft'],
      required: true,
    },
    location: {
      state: {
        type: String,
        default: '',
        required: true,
      },
      city: {type: String, required: true},
      street: {type: String},
      default: '',
      type: Object
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },

    verified: {
      type: Boolean,
      default: false,
      enum: [true, false],
      // required: true,
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

    selling: {
      type: Boolean,
      default: false,
      enum: [true, false],
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
infoSchema.plugin(toJSON);
infoSchema.plugin(paginate);
/**
 * @typedef Token
 */
const Info = mongoose.model('Info', infoSchema);

module.exports = Info;
