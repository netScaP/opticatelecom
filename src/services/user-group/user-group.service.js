// Initializes the `user-group` service on path `/user-group`
const createService = require('feathers-sequelize');
const createModel = require('../../models/user-group.model');
const hooks = require('./user-group.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/user-group', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('user-group');

  service.hooks(hooks);
};
