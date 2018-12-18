// events

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    const { app, params, type } = context;
    const { followerIdField, followingIdField, subService, idField } = options;

    let data;

    if (type === 'before') {
      data = {
        [followingIdField]: context.id,
        [followerIdField]: params.user.id
      };
    } else if (idField && type === 'after') {
      data = {
        [followingIdField]: context.result[idField],
        [followerIdField]: params.user.id
      };
    }

    try {
      await app.service(subService).create(data, params.headers);
    } catch (err) {
      // You already subscribed to current group
    }
    
    return context;
  };
};
