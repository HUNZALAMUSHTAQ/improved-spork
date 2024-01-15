const mongoose = require('mongoose');
const project = require('../models/project.model');
const ApiError = require('../utils/ApiError');

async function create(obj) {
  return project.create(obj);
}

/**
 * Query for projects
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getProjects = async (filter, options) => {
  const projects = await project.paginate(filter, options);
  return projects;
};

/**
 * Get user by id
 * @param {Object} query
 * @returns {Promise<project>}
 */
const getProject = async (query) => {
  return project.findOne(query);
};

module.exports.createProject = create;
module.exports.getProjects = getProjects;
module.exports.getProject = getProject;
