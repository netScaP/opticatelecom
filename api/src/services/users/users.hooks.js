const { authenticate } = require('@feathersjs/authentication').hooks;
const { associateCurrentUser, restrictToOwner } = require('feathers-authentication-hooks');
const { discard } = require('feathers-hooks-common');

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
          as: 'followers',
          through: { attributes: [] },
          attributes: ['id', 'name', 'city', 'phone', 'createdAt']
        }, 
        {
          model: 'events',
          as: 'events',
          through: { attributes: ['id'] },
          include: [
            {
              model: 'users',
              as: 'author',
              attributes: ['id', 'name', 'city', 'phone', 'createdAt']
            }
          ]
        },
        {
          model: 'groups',
          as: 'groups',
          through: { attributes: ['id'] }
        }
      ])
    ],
    create: [ hashPassword() ],
    update: [ 
      hashPassword(), 
      authenticate('jwt'),
      restrictToOwner({ idField: 'id', ownerField: 'id' })
    ],
    patch: [ 
      hashPassword(), 
      authenticate('jwt'),
      restrictToOwner({ idField: 'id', ownerField: 'id' })
    ],
    remove: [ 
      authenticate('jwt'),
      restrictToOwner({ idField: 'id', ownerField: 'id' })
    ]
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
