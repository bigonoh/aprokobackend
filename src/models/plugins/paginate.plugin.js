/* eslint-disable no-param-reassign */
const { ArrayTotal } = require('../../utils/CalcArrayTotal');

const paginate = (schema) => {
  /**
   * @typedef {Object} QueryResult
   * @property {Document[]} results - Results found
   * @property {number} page - Current page
   * @property {number} limit - Maximum number of results per page
   * @property {number} totalPages - Total number of pages
   * @property {number} totalResults - Total number of documents
   */
  /**
   * Query for documents with pagination
   * @param {Object} [filter] - Mongo filter
   * @param {Object} [options] - Query options
   * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
   * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
   * @param {number} [options.limit] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   * @returns {Promise<QueryResult>}
   */
  schema.statics.paginate = async function (filter, options) {
    // Add regex matching for title field
    if (filter && filter.title) {
      filter.title = { $regex: new RegExp(filter.title, 'i') }; // 'i' for case-insensitive
    }

    // Add filtering by location
    if (filter && filter.location) {
      const locationFilter = JSON.parse(filter.location);

      filter['location.state'] = { $regex: new RegExp(locationFilter.value, 'i') };
      // filter['location.city'] = { $regex: new RegExp(locationFilter.value, 'i') };
      delete filter.location; // Remove the original location field
    }

    let sort = '';
    if (options.sortBy) {
      const sortingCriteria = [];
      options.sortBy.split(',').forEach((sortOption) => {
        const [key, order] = sortOption.split(':');

        sortingCriteria.push((order === 'desc' ? '-' : '') + key);
      });
      sort = sortingCriteria.join(' ');
    } else {
      sort = 'created_at';
    }

    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const skip = (page - 1) * limit;

    const countPromise = this.countDocuments(filter).exec();
    let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);
    let amountPromise = null;

    if (schema.obj.amount) {
      try {
        this.aggregate([{ $match: filter }, { $group: { _id: null, amount: { $sum: '$amount' } } }])
          .exec()
          .then((d) => {
            amountPromise = d;
          });
      } catch (error) {
        console.log(error);
      }
    }

    if (options.populate) {
      options.populate.split(',').forEach((populateOption) => {
        docsPromise = docsPromise.populate(populateOption.split('.').reduce((a, b) => ({ path: b, populate: a })));
      });
    }

    docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise, amountPromise]).then((values) => {
      const [totalResults, results] = values;

      const totalPages = Math.ceil(totalResults / limit);
      const result = {
        results,
        page,
        limit,
        totalPages,
        totalResults,
        ...(amountPromise ? { amount: amountPromise.length > 0 ? amountPromise[0].amount : 0 } : ''),
      };
      return Promise.resolve(result);
    });
  };
};

module.exports = paginate;
