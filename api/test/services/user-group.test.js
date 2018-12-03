const assert = require('assert');
const app = require('../../src/app');

describe('\'user-group\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-group');

    assert.ok(service, 'Registered the service');
  });
});
