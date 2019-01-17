const { authenticate } = require('@feathersjs/authentication').hooks;
const { associateCurrentUser, restrictToOwner } = require('feathers-authentication-hooks');
const { disallow } = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [
      associateCurrentUser({ idField: 'id', as: 'followerId' })
    ],
    update: [
      disallow()
    ],
    patch: [
      disallow()
    ],
    remove: [
      restrictToOwner({ idField: 'id', ownerField: 'followerId' })
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
