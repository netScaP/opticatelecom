<template>
  <div id="app">
    <div class="error-msg" v-if="appStatus.type === 'error'">
      {{ appStatus.message }}
    </div>
    <div class="nav" v-if="!isOnLoginPage()">
      <router-link class="nav__link" :to="{ name: 'home' }">Home </router-link>
      <router-link class="nav__link" :to="{ name: 'events' }">Events </router-link>
      <router-link class="nav__link" :to="{ name: 'users' }">Groups </router-link>
      <span v-if="isLoggedIn">
        <a class="nav__link" @click="logout">Logout</a>
      </span>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    appStatus() {
      return this.$store.getters.appStatus;
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
        .then(() => this.$router.push({ name: 'home' }));
    },
    isOnLoginPage() {
      return this.$route.path === '/';
    },
  },
  created() {
    this.$http.interceptors.response.use(undefined, (err) => {
      // eslint-disable-next-line
      if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
        this.$store.dispatch('logout');
      }
      throw err;
    });
  },
};
</script>

<style lang="sass">
body
  margin: 0px
  padding: 0px
  background: linear-gradient(to left, #76b852, #8DC26F)
#nprogress
  .bar
    background-color: black !important
    height: 2px !important
#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
.error-msg
  position: fixed
  right: 0
  top: 1
  z-index: 10001
  max-width: 300px
  margin-right: 1px
  padding: 10px
  border: 1px solid red
  border-radius: 5px
  background-color: white
.nav
  padding: 30px
  &__link
    font-weight: bold
    color: #2c3e50
    text-decoration: none
    &.router-link-exact-active
      color: white
</style>
