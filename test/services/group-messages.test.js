const assert = require('assert');
const app = require('../../src/app');

describe('\'group-messages\' service', () => {
  it('registered the service', () => {
    const service = app.service('group-messages');

    assert.ok(service, 'Registered the service');
  });
});
