// events

const errors = require('@feathersjs/errors');

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    const { params: { query } } = context;

    if (!!query.hashtags && !(query.hashtags instanceof Array)) {
      throw new errors.BadRequest('Hashtags should be as an array. Try this out https://github.com/netScaP/Eventsapp/tree/master/api#help');
    }

    const hashtagsQuery = query.hashtags ? {
      hashtags: {
        $overlap: query.hashtags
      }
    } : {};

    context.params.sequelize = {
      order: [
        ['startEvent', 'ASC']
      ],
      where: {
        startEvent: {
          $gte: new Date()
        },
        ...hashtagsQuery
      }
    };
    
    return context;
  };
};
