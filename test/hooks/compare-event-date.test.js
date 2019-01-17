const assert = require('assert');
const feathers = require('@feathersjs/feathers');

const compareEventDate = require('../../src/hooks/compare-event-date');

describe('\'compareEventDate\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async create(data) {
        return data;
      }
    });

    app.service('dummy').hooks({
      before: {
        create: compareEventDate()
      }      
    });

  });

  it('Runs the hook', async () => {
    const data = {
      startEvent: new Date(),
      endEvent: new Date() + 10000
    };
    const result = await app.service('dummy').create(data);

    assert.equal(result, data);
  });

  it('Return error - uncorrect startEvent and endEvent', async () => {
    try {
      await app.service('dummy').create({
        startEvent: new Date() + 10000,
        endEvent: new Date()
      });
    } catch (err) {
      assert.equal(err.code, 401);
      assert.equal(err.message, 'StartEvent must be before of it end.');
    }
  });

});
