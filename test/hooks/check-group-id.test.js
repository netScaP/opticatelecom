const assert = require('assert');
const feathers = require('@feathersjs/feathers');

const checkGroupId = require('../../src/hooks/check-group-id');

describe('\'checkGroupId\' hook', () => {
  let app, fieldName;

  fieldName = 'eventId';

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async get(id, params) {
        return { id, query: params.query };
      }
    });

    app.service('dummy').hooks({
      before: checkGroupId({ fieldName })
    });
  });

  it('Should return a error, because query is empty', async () => {
    try {
      await app.service('dummy').get(0);
    } catch (err) {
      assert.equal(err.code, 400);
      assert.equal(err.message, 'You should pass a "groupId" as a query');
    }
  });

  it('Rename query groupId to passed fieldName', async () => {
    const groupId = 1;
    const result = await app.service('dummy').get(0, {
      query: {
        groupId
      }
    });
    
    assert.ok(result.query[fieldName]);
    assert.equal(result.query[fieldName], groupId);
  });

});
