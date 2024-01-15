const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const workSpaceSchema = mongoose.Schema(
  {
    context: String,
    question: String,
    doNotInclude: String,
    userId: String,
    aiRecommendation: Object,
    totalResults: Number,
    totalCreditsUsed: Number,
    results: [mongoose.Schema.Types.Mixed],
    query: String,
    isFavourite: Boolean,
    name: String,
    uuid: String,
  },
  {
    timestamps: true,
    strict: false
  }
);

// add plugin that converts mongoose to json
workSpaceSchema.plugin(toJSON);
workSpaceSchema.plugin(paginate);


/**
 * @typedef workSpace
 */
const WorkSpace = mongoose.model('WorkSpace', workSpaceSchema);

module.exports = WorkSpace;
