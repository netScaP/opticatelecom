// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const events = sequelizeClient.define('events', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING
    },
    hashtags: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    startEvent: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endEvent: {
      type: DataTypes.DATE,
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
  events.associate = function (models) {
    events.belongsToMany(models.users, {
      through: 'event_followers',
      as: 'followers',
      foreignKey: 'followingId'
    });

    events.belongsTo(models.users, {
      foreignKey: 'createdBy',
      as: 'author'
    });
    events.hasMany(models.event_messages, {
      as: 'messages'
    });
  };

  return events;
};
