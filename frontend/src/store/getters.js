const getters = {
  isLoggedIn(state) {
    return !!state.token;
  },
  appStatus(state) {
    return state.status;
  },
};

export default getters;
