const mongoose = require('mongoose');
const transaction = require('../models/transaction.model');

async function create(obj) {
  return transaction.create(obj);
}

/**
 * Query for transactions
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getTransactions = async (filter, options) => {
  const Transactions = await transaction.paginate(filter, options);
  return Transactions;
};

module.exports.createTransaction = create;
module.exports.getTransactions = getTransactions;
