// events

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    const { app, id, params } = context;
    const { followerIdField, followingIdField, subService } = options;

    const data = {
      [followingIdField]: id,
      [followerIdField]: params.user.id
    };

    try {
      await app.service(subService).create(data, params.headers);
    } catch (err) {
      // You already subscribed to current group
    }
    
    return context;
  };
};
