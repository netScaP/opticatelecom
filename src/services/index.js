const users = require('./users/users.service.js');
const events = require('./events/events.service.js');
const groupMessages = require('./group-messages/group-messages.service.js');
const userFollowers = require('./user-followers/user-followers.service.js');
const eventFollowers = require('./event-followers/event-followers.service.js');
const eventMessages = require('./event-messages/event-messages.service.js');
const groups = require('./groups/groups.service.js');
const userGroup = require('./user-group/user-group.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(events);
  app.configure(groupMessages);
  app.configure(userFollowers);
  app.configure(eventFollowers);
  app.configure(eventMessages);
  app.configure(groups);
  app.configure(userGroup);
};
