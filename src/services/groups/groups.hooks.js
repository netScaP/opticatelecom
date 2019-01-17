const { authenticate } = require('@feathersjs/authentication').hooks;
const { restrictToOwner, associateCurrentUser } = require('feathers-authentication-hooks');
const include = require('feathers-include-hook');

const restrictToAssociated = require('../../hooks/restrict-to-associated');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [
      include([
        {
          model: 'users',
          as: 'users',
          context: {
            where: {
              id: '$params.user.id'
            }
          },
          through: { attributes: [] },
          attributes: ['id', 'name', 'city', 'phone', 'createdAt']
        }
      ])
    ],
    get: [
      restrictToAssociated({ idField: 'id', 'model': 'users', 'as': 'users' }),
      include([
        {
          model: 'users',
          as: 'users',
          through: { attributes: [] },
          attributes: ['id', 'name', 'city', 'phone', 'createdAt']
        }, {
          model: 'group_messages',
          as: 'messages',
          include: [
            {
              model: 'users',
              attributes: ['id', 'name']
            }
          ]
        }
      ])
    ],
    create: [
      associateCurrentUser({ idField: 'id', as: 'creatorId' })
    ],
    update: [
      restrictToOwner({ idFiled: 'id', ownerField: 'creatorId' })
    ],
    patch: [
      restrictToOwner({ idFiled: 'id', ownerField: 'creatorId' })
    ],
    remove: [
      restrictToOwner({ idFiled: 'id', ownerField: 'creatorId' })
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
