const { authenticate } = require('@feathersjs/authentication').hooks;
const { associateCurrentUser, restrictToOwner } = require('feathers-authentication-hooks');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [
      associateCurrentUser({ idField: 'id', as: 'userId' })
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
