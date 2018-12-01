const users = require('./users/users.service.js');
const events = require('./events/events.service.js');
const messages = require('./messages/messages.service.js');
const userFollowers = require('./user-followers/user-followers.service.js');
const eventFollowers = require('./event-followers/event-followers.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(events);
  app.configure(messages);
  app.configure(userFollowers);
  app.configure(eventFollowers);
};
