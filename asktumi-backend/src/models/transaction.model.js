const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const transactionSchema = mongoose.Schema(
  {
    question: String,
    tokensUsed: Number,
    remainingTokens: Number,
    history: Array,
    userId: String,
    projectId: String,
    chatId: String,
  },
  {
    timestamps: true,
    strict: false,
  }
);

// add plugin that converts mongoose to json
transactionSchema.plugin(toJSON);
transactionSchema.plugin(paginate);

/**
 * @typedef Project
 */
const Transaction = mongoose.model('transaction', transactionSchema);

module.exports = Transaction;
