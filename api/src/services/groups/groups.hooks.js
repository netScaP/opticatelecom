const { authenticate } = require('@feathersjs/authentication').hooks;
const { associateCurrentUser, restrictToOwner } = require('feathers-authentication-hooks');
const include = require('feathers-include-hook');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [ // restrict to associated users
      include([
        {
          model: 'users',
          as: 'users'
        }
      ])
    ],
    get: [
      include([
        {
          model: 'users',
          as: 'users',
          attributes: ['id']
        },
        {
          model: 'group_messages',
          as: 'messages'
        }
      ]),
      // restrictToOwner({ idField: 'id', 'ownerField': 'usersId', array: true })
    ],
    create: [],
    update: [],
    patch: [],
    remove: []
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
