// Initializes the `groups` service on path `/groups`
const createService = require('feathers-sequelize');
const createModel = require('../../../../src/models/groups.model');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/groups', createService(options));

};
