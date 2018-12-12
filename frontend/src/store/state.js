const state = {
  status: '',
  user: {},
  token: localStorage.getItem('token') || '',
  apiUrl: 'http://localhost:3030/',
  api: {
    getToken: { name: 'authentication', method: 'post' },
    register: { name: 'users', method: 'post' },
    getUsers: { name: 'users/', method: 'get' },
    findEvents: { name: 'events', method: 'get' },
  },
};

export default state;
