// Initializes the `userFollowers` service on path `/user-followers`
const createService = require('feathers-sequelize');
const createModel = require('../../../../src/models/user-followers.model');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/user-followers', createService(options));

};
