// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = [ ]) {
  return async context => {
    const sequelize = context.app.get('sequelizeClient');
    const { models } = sequelize;
    
    const raw = false;

    if (!context.params.sequelize) {
      context.params.sequelize = {};
    }

    const include = options.map(obj => {
      return {
        ...obj,
        required: false,
        model: models[obj.model]
      }
    });

    Object.assign(context.params.sequelize, { include, raw });

    return context;
  };
};
