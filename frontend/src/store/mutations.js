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
  delete_event_from_user(state, eventIndex) {
    state.user.events.splice(eventIndex, 1);
  },
  add_friend_to_user(state, friend) {
    state.user.friends.unshift(friend);
  },
  delete_friend_from_user(state, friendIndex) {
    state.user.friends.splice(friendIndex, 1);
  },
};

export default mutations;
