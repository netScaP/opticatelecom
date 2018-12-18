const mutations = {
  auth_request(state) {
    state.status.type = 'loading';
    state.status.message = '';
  },
  auth_success(state, { token, user }) {
    state.status.type = 'success';
    state.status.message = '';
    state.token = token;
    state.user = user;
  },
  flash_error(state, err) {
    state.status.type = 'error';
    state.status.message = err;
  },
  logout(state) {
    state.status.type = '';
    state.status.message = '';
    state.token = '';
    state.user = {};
  },
  add_event_to_user(state, event) {
    state.user.events.unshift(event);
  },
};

export default mutations;
