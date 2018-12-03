const { authenticate } = require('@feathersjs/authentication').hooks;
const { associateCurrentUser, restrictToOwner } = require('feathers-authentication-hooks');
const include = require('feathers-include-hook');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [
      include([
        {
          model: 'users',
          as: 'followers'
        },
        {
          model: 'users',
          as: 'author'
        }
      ])
    ],
    get: [
      include([
        {
          model: 'users',
          as: 'followers'
        },
        {
          model: 'users',
          as: 'author'
        },
        {
          model: 'event_messages',
          as: 'messages'
        }
      ])
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
