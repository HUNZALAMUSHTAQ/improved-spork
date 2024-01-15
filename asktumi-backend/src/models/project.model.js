const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const projectSchema = mongoose.Schema(
  {
    userId: String,
    name: String,
    chatBotId: String,
  },
  {
    timestamps: true,
    strict: false
  }
);

// add plugin that converts mongoose to json
projectSchema.plugin(toJSON);
projectSchema.plugin(paginate);


/**
 * @typedef Project
 */
const Project = mongoose.model('project', projectSchema);

module.exports = Project;
