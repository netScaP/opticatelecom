// events

const errors = require('@feathersjs/errors');

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    const { params: { query } } = context;

    if (!(query.hashtags instanceof Array)) {
      throw new errors.BadRequest('Hashtags should be as an array. Try this out https://github.com/netScaP/Eventsapp/tree/master/api#help');
    }

    context.params.sequelize = {
      order: [
        ['startEvent', 'ASC']
      ],
      where: {
        startEvent: {
          $gte: new Date()
        },
        hashtags: {
          $overlap: query.hashtags
        }
      }
    };
    
    return context;
  };
};
