const { authenticate } = require('@feathersjs/authentication').hooks;
const { associateCurrentUser, restrictToOwner } = require('feathers-authentication-hooks');
const include = require('feathers-include-hook');

const subToGroup = require('../../hooks/sub-to-group');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [
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
      include([{
        model: 'users',
        as: 'followers',
        attributes: ['id', 'name', 'city', 'phone', 'createdAt'],
        through: { attributes: [] }
      }, {
        model: 'users',
        as: 'author',
        attributes: ['id', 'name', 'city', 'phone', 'createdAt']
      }, {
        model: 'event_messages',
        as: 'messages',
        include: [
          {
            model: 'users',
            attributes: ['id', 'name']
          }
        ]
      }]), 
      subToGroup({ followerIdField: 'followerId', followingIdField: 'followingId', subService: 'event-followers' })
    ],
    create: [
      associateCurrentUser({ idField: 'id', as: 'createdBy' })
    ],
    update: [
      restrictToOwner({ idField: 'id', ownerField: 'createdBy' })
    ],
    patch: [
      restrictToOwner({ idField: 'id', ownerField: 'createdBy' })
    ],
    remove: [
      restrictToOwner({ idField: 'id', ownerField: 'createdBy' })
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
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
