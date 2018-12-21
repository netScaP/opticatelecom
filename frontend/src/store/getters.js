const getters = {
  isLoggedIn(state) {
    return !!state.token && !!state.user;
  },
  appStatus(state) {
    return state.status;
  },
  newEvent(state) {
    return state.newEvent;
  },
  userEvents(state) {
    return state.user.events;
  },
  userFriends(state) {
    return state.user.friends;
  },
  getApiMethods(state) {
    return state.api;
  },
  getApiUrl(state) {
    return state.apiUrl;
  },
};

export default getters;
