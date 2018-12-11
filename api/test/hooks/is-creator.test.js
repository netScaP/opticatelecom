const assert = require('assert');

const dbCleaning = require('../utils/db-cleaner');

const isCreator = require('../../src/hooks/is-creator');

describe('\'isCreator\' hook', () => {
  let app, creator, user, group;

  creator = {
    id: '1',
    email: 'creator@mail.ru',
    password: 'testPassword',
    name: 'test',
    city: 'testCity',
    phone: '1231231'
  };

  user = {
    id: '2',
    email: 'test@mail.ru',
    password: 'testPassword',
    name: 'test',
    city: 'testCity',
    phone: '123131'
  };

  group = {
    id: '1',
    creatorId: creator.id,
    title: 'test group'
  };

  beforeEach((done) => {
    app = require('../../src/app');

    app.service('user-group').hooks({
      before: {
        create: isCreator({ idField: 'id', ownerField: 'creatorId', service: 'groups', fieldWithId: 'followingId', type: 'error' }),
        remove: isCreator({ idField: 'id', ownerField: 'creatorId', service: 'groups', fieldWithId: 'followingId' })
      }
    });

    dbCleaning(app, done);
   
  });

  it('Should return error because hook not available for GET and FIND', async () => {

    app.service('user-group').hooks({
      before: {
        find: isCreator()
      }
    });
   
    try {
      await app.service('user-group').find();
    } catch (err) {
      assert.equal(err.code, 405);
      assert.equal(err.message, 'The "isCreator" hook should only be used on the "create", "update", "patch" and "remove" service methods.');
    }

  });

  it('Should return error because only creator can add user to the group', async () => {
    
    await app.service('users').create(creator);
    await app.service('users').create(user);
    await app.service('groups').create(group);

    let params = {
      user
    };

    try {
      await app.service('user-group').create({
        followerId: user.id,
        followingId: group.id
      }, params);
    } catch (err) {
      assert.equal(err.code, 403);
      assert.equal(err.message, 'You do not have the permissions to access this.');
    }

  });

  it('Create a user-group association', async () => {

    await app.service('users').create(creator);
    await app.service('users').create(user);
    await app.service('groups').create(group);

    let params = {
      user
    };

    const result = await app.service('user-group').create({
      id: '1',
      followerId: user.id,
      followingId: group.id
    }, params);

    assert.equal(result.id, 1);
    assert.equal(result.followerId, user.id);
    assert.equal(result.followingId, group.id);

  });

  it('Delete the user-group association by the user and a creator', async () => {

    await app.service('users').create(creator);
    await app.service('users').create(user);
    await app.service('groups').create(group);

    let params = {
      user
    };

    await app.service('user-group').create({
      id: '1',
      followerId: user.id,
      followingId: group.id
    }, params);

    await app.service('user-group').remove(1, params);

    await app.service('user-group').create({
      id: '1',
      followerId: user.id,
      followingId: group.id
    }, params);

    let creatorParams = {
      user: creator
    };

    await app.service('user-group').remove(1, creatorParams);

  });

});
