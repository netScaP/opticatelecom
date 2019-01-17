// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const groups = sequelizeClient.define('groups', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  groups.associate = function (models) {
    groups.hasMany(models.group_messages, {
      as: 'messages'
    });
    groups.belongsTo(models.users, {
      as: 'creator'
    });
    groups.belongsToMany(models.users, {
      through: 'user_group',
      as: 'users',
      foreignKey: 'followingId'
    });
  };

  return groups;
};
