const { authenticate } = require('@feathersjs/authentication').hooks;
const { associateCurrentUser, restrictToOwner } = require('feathers-authentication-hooks');

const include = require('feathers-include-hook');

const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;

module.exports = {
  before: {
    all: [],
    find: [ 
      authenticate('jwt')
    ],
    get: [ 
      authenticate('jwt'),
      restrictToOwner({ idField: 'id', ownerField: 'id' }),
      include([
        {
          model: 'users',
          as: 'followers'
        }, 
        {
          model: 'events',
          as: 'eventFollows'
        },
        {
          model: 'groups',
          as: 'groups'
        }
      ])
    ],
    create: [ hashPassword() ],
    update: [ hashPassword(),  authenticate('jwt') ],
    patch: [ hashPassword(),  authenticate('jwt') ],
    remove: [ authenticate('jwt') ]
  },

  after: {
    all: [ 
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
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
