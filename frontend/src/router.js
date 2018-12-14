import Vue from 'vue';
import Router from 'vue-router';

import Auth from './views/Auth.vue';
import Events from './views/Events.vue';
import Users from './views/Users.vue';
import Groups from './views/Groups.vue';

import store from './store';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Auth,
      meta: {
        excludeAuth: true,
      },
    },
    {
      path: '/events',
      name: 'events',
      component: Events,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/users',
      name: 'users',
      component: Users,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/groups',
      name: 'groups',
      component: Groups,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next();
      return;
    }
    next('/');
  } else {
    next();
  }
  if (to.matched.some(record => record.meta.excludeAuth)) {
    if (store.getters.isLoggedIn) {
      next('/events');
      return;
    }
    next();
  } else {
    next();
  }
});

export default router;
