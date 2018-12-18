import axios from 'axios';
import jwtDecode from 'jwt-decode';

const actions = {
  register({ commit, dispatch, state }, user) { // set the state.user
    return new Promise((resolve, reject) => {
      commit('auth_request');
      axios({
        url: state.apiUrl + state.api.register.name,
        data: user,
        method: state.api.register.method,
      })
        .then((response) => {
          const registeredUser = response.data;
          return dispatch('login', registeredUser);
        })
        .catch((err) => {
          commit('flash_error', 'Данные заполнены неверно');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          reject(err);
        });
    });
  },
  login({ commit, state }, userCredentials) { // set the state.token
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
            url: state.apiUrl + state.api.getUsers.name + userId,
            method: state.api.getUsers.method,
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
          commit('add_event_to_user', response.data);
          resolve(response.data);
        })
        .catch((err) => {
          commit('flash_error', 'Something went wrong');
          reject(err);
        });
    });
  },
};

export default actions;
