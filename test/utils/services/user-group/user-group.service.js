// Initializes the `user-group` service on path `/user-group`
const createService = require('feathers-sequelize');
const createModel = require('../../../../src/models/user-group.model');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/user-group', createService(options));

};
