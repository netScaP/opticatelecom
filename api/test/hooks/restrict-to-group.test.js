const assert = require('assert');

const dbCleaning = require('../utils/db-cleaner');

const restrictToGroup = require('../../src/hooks/restrict-to-group');

describe('\'restrictToGroup\' hook', () => {
  let app, user, user2, event;

  user = {
    id: '1',
    email: 'test@mail.ru',
    password: 'testPassword',
    name: 'test',
    city: 'testCity',
    phone: '1231231'
  };

  user2 = {
    id: '2',
    email: 'test2@mail.ru',
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

    app.service('event-messages').hooks({
      before: {
        create: restrictToGroup({ model: 'events', as: 'events', fieldWithId: 'eventId' })
      }
    });

    dbCleaning(app, done);
   
  });

  it('Should return error when add a message to the event (not associated)', async () => {
    
    await app.service('users').create(user);
    await app.service('users').create(user2);

    let params = {
      user
    };

    await app.service('events').create(event, params);

    params = {
      user: user2
    };

    try {
      await app.service('event-messages').create({
        id: '1',
        text: 'error message',
        eventId: event.id,
        userId: user.id
      }, params);
    } catch (err) {
      assert.equal(err.code, 403);
      assert.equal(err.message,  'You do not have the permissions to access this.');
    }

  });

  it('Add a message (associated)', async () => {

    await app.service('users').create(user);

    let params = {
      user
    };

    await app.service('events').create(event, params);

    const result = await app.service('event-messages').create({
      id: '1',
      text: 'Message',
      eventId: event.id,
      userId: user.id
    }, params);

    assert.equal(result.text, 'Message');
    assert.equal(result.eventId, event.id);
    assert.equal(result.userId, user.id);

  });

});
