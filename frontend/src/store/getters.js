const getters = {
  isLoggedIn(state) {
    return !!state.token;
  },
  authStatus(state) {
    return state.status;
  },
};

export default getters;
