const { authenticate } = require('@feathersjs/authentication').hooks;
const { associateCurrentUser, restrictToOwner } = require('feathers-authentication-hooks');
const { disallow, iff } = require('feathers-hooks-common');
const include = require('feathers-include-hook');

const checkGroupId = require('../../hooks/check-group-id');
const restrictToGroup = require('../../hooks/restrict-to-group');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [
      checkGroupId({ fieldName: 'eventId' }), 
      include([
        {
          model: 'events',
          attributes: ['id'],
          include: [
            {
              model: 'users',
              as: 'followers',
              attributes: [],
              context: {
                where: {
                  id: '$params.user.id'
                }
              }
            }
          ]
        },
        {
          model: 'users',
          attributes: ['id', 'name']
        }
      ])
    ],
    get: [
      iff(context => context.params.provider, disallow()) // for restrictToOwner call
    ],
    create: [
      restrictToGroup({ model: 'events', as: 'events', fieldWithId: 'eventId' }),
      associateCurrentUser({ idField: 'id', as: 'userId' })
    ],
    update: [
      restrictToOwner({ idField: 'id', ownerField: 'userId' })
    ],
    patch: [
      restrictToOwner({ idField: 'id', ownerField: 'userId' })
    ],
    remove: [
      restrictToOwner({ idField: 'id', ownerField: 'userId' })
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
