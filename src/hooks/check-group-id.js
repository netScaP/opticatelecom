// event-messages group-messages

const errors = require('@feathersjs/errors');

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    const { query } = context.params;
    const { fieldName } = options;
    
    if (!query || !query.groupId) {
      throw new errors.BadRequest('You should pass a "groupId" as a query');
    }

    if (fieldName) {
      query[fieldName] = query.groupId;
      delete query.groupId;
    }
    
    return context;
  };
};
