const { authenticate } = require('@feathersjs/authentication').hooks;
const { restrictToOwner } = require('feathers-authentication-hooks');
const { disallow, iff, isNot } = require('feathers-hooks-common');

const isCreator = require('../../hooks/is-creator');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [
      isCreator({ idField: 'id', ownerField: 'creatorId', service: 'groups', fieldWithId: 'followingId', type: 'error' })
    ],
    update: [
      disallow()
    ],
    patch: [
      disallow()
    ],
    remove: [
      isCreator({ idField: 'id', ownerField: 'creatorId', service: 'groups', fieldWithId: 'followingId' }),
      iff(isNot(hook => hook.isCreator), restrictToOwner({ idField: 'id', ownerField: 'followerId' }))
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
