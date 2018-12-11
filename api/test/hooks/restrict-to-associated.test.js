const assert = require('assert');

const dbCleaning = require('../utils/db-cleaner');

const restrictToAssociated = require('../../src/hooks/restrict-to-associated');

describe('\'restrictToAssociated\' hook', () => {
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
    phone: '1231231'
  };

  group = {
    id: '1',
    creatorId: creator.id, 
    title: 'test group'
  };

  beforeEach((done) => {
    app = require('../../src/app');

    app.service('groups').hooks({
      before: {
        get: restrictToAssociated({ idField: 'id', 'model': 'users', 'as': 'users' })
      }
    });

    dbCleaning(app, done);
   
  });

  it('Should return error when try to get a group (not associated)', async () => {
    
    await app.service('users').create(creator);
    await app.service('users').create(user);
    await app.service('groups').create(group);

    let params = {
      user
    };

    try {
      await app.service('groups').get(group.id, params);
    } catch (err) {
      assert.equal(err.code, 403);
      assert.equal(err.message, 'You do not have the permissions to access this.');
    }

  });

  it('Get a group info', async () => {

    await app.service('users').create(creator);
    await app.service('groups').create(group);

    let params = {
      user: creator
    };

    await app.service('user-group').create({
      id: '1',
      followerId: creator.id,
      followingId: group.id
    });

    const result = await app.service('groups').get(group.id, params);

    assert.equal(result.id, group.id);

  });

});
