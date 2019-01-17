const assert = require('assert');
const app = require('../../src/app');

describe('\'eventFollowers\' service', () => {
  it('registered the service', () => {
    const service = app.service('event-followers');

    assert.ok(service, 'Registered the service');
  });
});
