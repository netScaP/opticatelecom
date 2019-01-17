// Initializes the `event-messages` service on path `/event-messages`
const createService = require('feathers-sequelize');
const createModel = require('../../models/event-messages.model');
const hooks = require('./event-messages.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/event-messages', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('event-messages');

  service.hooks(hooks);
};
