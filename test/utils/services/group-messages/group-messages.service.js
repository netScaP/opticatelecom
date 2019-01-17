// Initializes the `messages` service on path `/messages`
const createService = require('feathers-sequelize');
const createModel = require('../../../../src/models/group-messages.model');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/group-messages', createService(options));

};
