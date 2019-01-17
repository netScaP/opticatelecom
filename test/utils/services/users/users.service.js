// Initializes the `users` service on path `/users`
const createService = require('feathers-sequelize');
const createModel = require('../../../../src/models/users.model');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/users', createService(options));

};
