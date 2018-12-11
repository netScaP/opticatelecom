// groups

const errors = require('@feathersjs/errors');

const defaults = {
  idField: 'id',
  model: 'users'
};

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    const sequelize = context.app.get('sequelizeClient');
    const { models } = sequelize;

    options = Object.assign({}, defaults, context.app.get('authentication'), options);

    const userEntity = context.params[options.entity || 'user'];

    if (!context.params.provider) {
      return context;
    }

    if (!userEntity) {
      throw new errors.NotAuthenticated('The current user is missing. You should be authenticated.');
    }

    const id = userEntity[options.idField];

    if (id === undefined) {
      throw new Error(`'${options.idField} is missing from current user.'`);
    }
    
    const params = Object.assign({}, context.params, { provider: undefined }, {
      sequelize: {
        include: [{
          model: models[options.model],
          as: options.as
        }],
        raw: false
      }
    });

    let data = await context.service.get(context.id, params);
    if (data.toJSON) {
      data = data.toJSON();
    } else if (data.toObject) {
      data = data.toObject();
    }

    const modelData = data[options.as || options.model] === undefined ? data[options.model.slice(0, -1)] : data[options.as || options.model];

    if (!modelData) {
      throw new errors.BadRequest('There is no data');
    }

    if (Array.isArray(modelData)) {
      const modelArray = modelData.map(obj => obj[options.idField].toString());
      if (modelArray.length === 0 || modelArray.indexOf(id.toString()) < 0) {
        throw new errors.Forbidden('You do not have the permissions to access this.');
      }
    } else if (modelData === undefined || modelData[options.idField].toString() !== id.toString()) {
      throw new errors.Forbidden('You do not have the permissions to access this.');
    }

    return context;
  };
};