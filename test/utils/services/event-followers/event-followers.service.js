// Initializes the `eventFollowers` service on path `/event-followers`
const createService = require('feathers-sequelize');
const createModel = require('../../../../src/models/event-followers.model');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/event-followers', createService(options));

};
