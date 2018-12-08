// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

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
      await app.service(options.subService).create(data, params.headers);
    } catch (err) {
      // You already subscribed to current group
    }
    
    return context;
  };
};
