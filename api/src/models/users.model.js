// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const users = sequelizeClient.define('users', {
  
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.INTEGER
    },
  
  
    auth0Id: { type: Sequelize.STRING },
  
    facebookId: { type: Sequelize.STRING },
  
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  users.associate = function (models) {
    users.belongsToMany(users, {
      through: 'user_followers',
      as: 'UserFollowing',
      foreignKey: 'followerId'
    });
    users.belongsToMany(users, {
      through: 'user_followers',
      as: 'followers',
      foreignKey: 'followingId'
    });

    users.belongsToMany(models.groups, {
      through: 'user_group',
      as: 'groups',
      foreignKey: 'followerId'
    });

    users.belongsToMany(models.events, {
      through: 'event_followers',
      as: 'eventFollows',
      foreignKey: 'followerId'
    });
  };

  return users;
};
