const assert = require('assert');

const dbCleaning = require('../utils/db-cleaner');

const subToGroup = require('../../src/hooks/sub-to-group');

describe('\'subToGroup\' hook', () => {
  let app, user, event;

  user = {
    id: '1',
    email: 'test@mail.ru',
    password: 'testPassword',
    name: 'test',
    city: 'testCity',
    phone: '1231231'
  };

  event = {
    id: '1',
    title: 'testEvent',
    description: 'testDescription',
    city: 'testCity',
    hashtags: ['test', 'hashtag'],
    startEvent: '2018-01-01',
    endEvent: '2019-01-01',
    createdBy: user.id
  };

  beforeEach((done) => {
    app = require('../../src/app');

    app.service('events').hooks({
      before: {
        get: subToGroup({ followerIdField: 'followerId', followingIdField: 'followingId', subService: 'event-followers' })
      },
      after: {
        create: subToGroup({ followerIdField: 'followerId', followingIdField: 'followingId', subService: 'event-followers', idField: 'id' })
      }
    });

    dbCleaning(app, done);
   
  });

  it('Follow to group(event) from a hook', async () => {

    await app.service('users').create(user);

    let params = {
      user
    };

    await app.service('events').create(event, params);

    const result = await app.service('event-followers').find();

    assert.equal(result.total, 1);
    assert.equal(result.data[0].followerId, user.id);
    assert.equal(result.data[0].followingId, event.id);

  });

});
