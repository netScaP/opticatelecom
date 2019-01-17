const { authenticate } = require('@feathersjs/authentication').hooks;
const { associateCurrentUser, restrictToOwner } = require('feathers-authentication-hooks');
const include = require('feathers-include-hook');

const customEventSequelize = require('../../hooks/custom-event-sequelize');
const compareEventDate = require('../../hooks/compare-event-date');
const subToGroup = require('../../hooks/sub-to-group');
const emitEvent = require('../../hooks/emit-event');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [
      customEventSequelize(),
      include([
        {
          model: 'users',
          as: 'followers',
          attributes: ['id', 'name', 'city', 'phone', 'createdAt'],
          through: { attributes: [] }
        },
        {
          model: 'users',
          as: 'author',
          attributes: ['id', 'name', 'city', 'phone', 'createdAt']
        }
      ])
    ],
    get: [
      include([
        {
          model: 'users',
          as: 'followers',
          attributes: ['id', 'name', 'city', 'phone', 'createdAt'],
          through: { attributes: [] }
        },
        {
          model: 'users',
          as: 'author',
          attributes: ['id', 'name', 'city', 'phone', 'createdAt']
        },
        {
          model: 'event_messages',
          as: 'messages',
          include: [
            {
              model: 'users',
              attributes: ['id', 'name']
            }
          ]
        }
      ]), 
      subToGroup({ followerIdField: 'followerId', followingIdField: 'followingId', subService: 'event-followers' })
    ],
    create: [
      compareEventDate(),
      associateCurrentUser({ idField: 'id', as: 'createdBy' })
    ],
    update: [
      restrictToOwner({ idField: 'id', ownerField: 'createdBy' }),
      compareEventDate()
    ],
    patch: [
      restrictToOwner({ idField: 'id', ownerField: 'createdBy' }),
      compareEventDate()
    ],
    remove: [
      restrictToOwner({ idField: 'id', ownerField: 'createdBy' })
    ]
  },

  after: {
    all: [],
    find: [],
    get: [
      emitEvent({ eventName: 'eventJoin' })
    ],
    create: [
      subToGroup({ followerIdField: 'followerId', followingIdField: 'followingId', subService: 'event-followers', idField: 'id' }),
      emitEvent({ eventName: 'eventJoin' })
    ],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
