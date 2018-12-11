// Initializes the `event-messages` service on path `/event-messages`
const createService = require('feathers-sequelize');
const createModel = require('../../../../src/models/event-messages.model');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/event-messages', createService(options));

};
