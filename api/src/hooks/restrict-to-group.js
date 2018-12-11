// event-messages group-messages

const errors = require('@feathersjs/errors');

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    const { app, params, data } = context;

    const sequelize = context.app.get('sequelizeClient');
    const { models } = sequelize;

    let response = await app.service('users').get(params.user.id, {
      sequelize: {
        raw: false,
        required: false,
        include: [
          {
            model: models[options.model],
            as: options.as
          }
        ]
      }
    });

    if (response.toJSON) {
      response = response.toJSON();
    } else if (response.toObject) {
      response = response.toObject();
    }

    const groupFollows = response[options.as];

    if (!groupFollows) {
      throw new errors.Forbidden('You do not have the permissions to access this.');
    }

    const groupsId = groupFollows.map(obj => obj.id.toString());
    
    if (groupsId.length === 0 || groupsId.indexOf(data[options.fieldWithId].toString()) < 0) {
      throw new errors.Forbidden('You do not have the permissions to access this.');
    }

    return context;
  };
};
