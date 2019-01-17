// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const userGroup = sequelizeClient.define('user_group', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER 
    },
    followerId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    followingId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'groups',
        key: 'id'
      }
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  userGroup.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return userGroup;
};
