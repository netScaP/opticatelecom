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
    findUsers: { name: 'users', method: 'get' },
    getUser: { name: 'users/', method: 'get' },
    addFriend: { name: 'user-followers', method: 'post' },
    deleteFriend: { name: 'user-followers/', method: 'delete' },
    findEvents: { name: 'events', method: 'get' },
    createEvent: { name: 'events', method: 'post' },
    followToEvent: { name: 'event-followers', method: 'post' },
    exitFromEvent: { name: 'event-followers/', method: 'delete' },
  },
};

export default state;
