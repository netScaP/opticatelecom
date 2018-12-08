const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const restrictToAssociated = require('../../src/hooks/restrict-to-associated');

describe('\'restrictToAssociated\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async get(id) {
        return { id };
      }
    });

    app.service('dummy').hooks({
      before: restrictToAssociated()
    });
  });

  it('runs the hook', async () => {
    const result = await app.service('dummy').get('test');
    
    assert.deepEqual(result, { id: 'test' });
  });
});
