// events

const errors = require('@feathersjs/errors');

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    const { data } = context;

    if (data.startEvent > data.endEvent) {
      throw new errors.BadRequest('StartEvent must be before of it end.');
    }
    return context;
  };
};
