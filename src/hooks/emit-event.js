// events

const errors = require('@feathersjs/errors');

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    const { service, params, result } = context;
    const { eventName } = options;

    if (!eventName) {
      throw new errors.BadRequest('Pass an eventName to emitEvent hook!');
    }

    service.emit(eventName, {
      user: params.user,
      eventId: result.id
    });

    return context;
  };
};
