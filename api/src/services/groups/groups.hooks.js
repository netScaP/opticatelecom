const { authenticate } = require('@feathersjs/authentication').hooks;
const { associateCurrentUser, restrictToOwner } = require('feathers-authentication-hooks');
const include = require('feathers-include-hook');

const restrictToAssociated = require('../../hooks/restrict-to-associated');
const subToGroup = require('../../hooks/sub-to-group');

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
      ]),
      subToGroup({ followerIdField: 'followerId', followingIdField: 'followingId', subService: 'user-group' })
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
