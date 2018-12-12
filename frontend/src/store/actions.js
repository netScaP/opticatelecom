import axios from 'axios';
import jwtDecode from 'jwt-decode';

const actions = {
  register({ commit, dispatch, state }, user) { // set the state.user
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
        commit('auth_error');
        localStorage.removeItem('token');
        console.log(err);
      });
  },
  login({ commit, state }, userCredentials) { // set the state.token
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
        commit('auth_success', { token, user });
      })
      .catch((err) => {
        commit('auth_error');
        localStorage.removeItem('token');
        console.log(err);
      });
  },
  logout({ commit }) {
    commit('logout');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common.Authorization;
  },
};

export default actions;
