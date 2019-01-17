// Initializes the `events` service on path `/events`
const createService = require('feathers-sequelize');
const createModel = require('../../../../src/models/events.model');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/events', createService(options));

};
