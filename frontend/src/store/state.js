const state = {
  status: {
    type: '',
    message: '',
  },
  user: JSON.parse(localStorage.getItem('user')) || {},
  token: localStorage.getItem('token') || '',
  apiUrl: 'http://localhost:3030/',
  api: {
    getToken: { name: 'authentication', method: 'post' },
    register: { name: 'users', method: 'post' },
    getUsers: { name: 'users/', method: 'get' },
    findEvents: { name: 'events', method: 'get' },
    createEvent: { name: 'events', method: 'post' },
  },
};

export default state;
