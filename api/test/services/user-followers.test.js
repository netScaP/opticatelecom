const assert = require('assert');
const app = require('../../src/app');

describe('\'userFollowers\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-followers');

    assert.ok(service, 'Registered the service');
  });
});
