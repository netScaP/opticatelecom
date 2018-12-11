// user-group

const errors = require('@feathersjs/errors');

const defaults = {
  idField: '_id',
  ownerField: 'creatorId',
  service: 'groups'
};

// only set context.isCreator to true or false
module.exports = function (options = {}) {
  return async context => {
    const { params, method, app, service, id } = context;
    let { data } = context;

    options = Object.assign({}, defaults, options);

    if (!params.provider) {
      return context;
    }

    if (!(method === 'create' || method === 'update' || method === 'patch' || method === 'remove')) {
      throw new errors.MethodNotAllowed('The "isCreator" hook should only be used on the "create", "update", "patch" and "remove" service methods.');
    }

    if (!options.service) {
      throw new errors.MethodNotAllowed('You must a provider "service" as an hook option');
    }

    if (method === 'remove' || method === 'update' || method === 'patch') {
      data = data || {};
      let response = await service.get(id);
      data[options.fieldWithId] = response[options.fieldWithId];
    }
    
    if (!data || !data[options.fieldWithId]) {
      throw new errors.BadRequest(`You must provide a data with "${options.fieldWithId}"`);
    }

    let result = await app.service(options.service).get(data[options.fieldWithId], { 
      ...params, 
      provider: undefined 
    });

    if (result[options.ownerField] !== params.user[options.idField]) {
      context.isCreator = false;
    } else {
      context.isCreator = true;
    }

    if (options.type === 'error' && context.isCreator === false) {
      throw new errors.Forbidden('You do not have the permissions to access this.');
    }

    return context;
  };
};
