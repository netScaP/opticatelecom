import axios from 'axios';
import jwtDecode from 'jwt-decode';

const actions = {
  register({ commit, dispatch, state }, user) {
    return new Promise((resolve, reject) => {
      commit('auth_request');
      axios({
        url: state.apiUrl + state.api.register.name,
        data: user,
        method: state.api.register.method,
      })
        .then((response) => {
          const registeredUser = Object.assign({}, user, response.data);
          return dispatch('login', registeredUser);
        })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          commit('flash_error', 'Данные заполнены неверно');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          reject(err);
        });
    });
  },
  login({ commit, state }, userCredentials) {
    return new Promise((resolve, reject) => {
      commit('auth_request');

      const data = {
        email: userCredentials.email,
        password: userCredentials.password,
        strategy: 'local',
      };

      let token;

      axios({
        url: state.apiUrl + state.api.getToken.name,
        data,
        method: state.api.getToken.method,
      })
        .then((response) => {
          token = response.data.accessToken;
          localStorage.setItem('token', token);
          axios.defaults.headers.common.Authorization = token;
          const { userId } = jwtDecode(token);
          return axios({
            url: state.apiUrl + state.api.getUser.name + userId,
            method: state.api.getUser.method,
          });
        })
        .then((response) => {
          const user = response.data;
          localStorage.setItem('user', JSON.stringify(user));
          commit('auth_success', { token, user });
          resolve(response);
        })
        .catch((err) => {
          commit('flash_error', 'Неправильный логин или пароль.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          reject(err);
        });
    });
  },
  logout({ commit }) {
    return new Promise((resolve) => {
      commit('logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common.Authorization;
      resolve();
    });
  },
  createEvent({ commit, state }, event) {
    return new Promise((resolve, reject) => {
      axios({
        url: state.apiUrl + state.api.createEvent.name,
        data: event,
        method: state.api.createEvent.method,
      })
        .then((response) => {
          const userLocal = JSON.parse(localStorage.getItem('user'));
          userLocal.events.unshift(response.data);
          localStorage.setItem('user', JSON.stringify(userLocal));
          commit('add_event_to_user', response.data);
          resolve(response.data);
        })
        .catch((err) => {
          commit('flash_error', 'Something went wrong');
          reject(err);
        });
    });
  },
  followToEvent({ commit, state }, event) {
    return new Promise((resolve, reject) => {
      const data = {
        followingId: event.id,
      };
      axios({
        url: state.apiUrl + state.api.followToEvent.name,
        method: state.api.followToEvent.method,
        data,
      })
        .then((response) => {
          const newEvent = {
            ...event,
            event_followers: response.data,
          };
          const userLocal = JSON.parse(localStorage.getItem('user'));
          userLocal.events.unshift(newEvent);
          localStorage.setItem('user', JSON.stringify(userLocal));
          commit('add_event_to_user', newEvent);
          resolve(response.data);
        })
        .catch((err) => {
          commit('flash_error', 'You already follow to this event');
          reject(err);
        });
    });
  },
  exitFromEvent({ commit, state }, event) {
    return new Promise((resolve, reject) => {
      const eventFollowId = event.event_followers.id;
      axios({
        url: state.apiUrl + state.api.exitFromEvent.name + eventFollowId,
        method: state.api.exitFromEvent.method,
      })
        .then(() => {
          const eventIndex = state.user.events.findIndex(elem => elem.id === event.id);
          const userLocal = JSON.parse(localStorage.getItem('user'));
          userLocal.events = userLocal.events || [];
          userLocal.events.splice(eventIndex, 1);
          localStorage.setItem('user', JSON.stringify(userLocal));
          commit('delete_event_from_user', eventIndex);
          resolve();
        })
        .catch((err) => {
          commit('flash_error', 'Something went wrong');
          reject(err);
        });
    });
  },
  addFriend({ commit, state }, friend) {
    return new Promise((resolve, reject) => {
      const data = {
        followingId: friend.id,
      };
      axios({
        url: state.apiUrl + state.api.addFriend.name,
        method: state.api.addFriend.method,
        data,
      })
        .then((response) => {
          const record = {
            ...friend,
            user_followers: {
              id: response.data.id,
            },
          };
          const userLocal = JSON.parse(localStorage.getItem('user'));
          userLocal.friends = userLocal.friends || [];
          userLocal.friends.push(record);
          localStorage.setItem('user', JSON.stringify(userLocal));
          commit('add_friend_to_user', record);
          resolve(record);
        })
        .catch((err) => {
          commit('flash_error', 'He(She) already your friend');
          reject(err);
        });
    });
  },
  deleteFriend({ commit, state }, friend) {
    return new Promise((resolve, reject) => {
      const friendFollowId = friend.user_followers.id;
      axios({
        url: state.apiUrl + state.api.deleteFriend.name + friendFollowId,
        method: state.api.deleteFriend.method,
      })
        .then(() => {
          const friendIndex = state.user.friends.findIndex(elem => elem.id === friend.id);
          const userLocal = JSON.parse(localStorage.getItem('user'));
          userLocal.friends = userLocal.friends || [];
          userLocal.friends.splice(friendIndex, 1);
          localStorage.setItem('user', JSON.stringify(userLocal));
          commit('delete_friend_from_user', friendIndex);
          resolve();
        })
        .catch((err) => {
          commit('flash_error', 'Something went wrong');
          reject(err);
        });
    });
  },
};

export default actions;
