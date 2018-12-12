<template>
  <div>
    <h1>Sign in</h1>
    <form @submit.prevent="login">
      <label for="email">Email</label>
      <input id="email" type="email" v-model="user.email" placeholder="E-mail" required>
      <label for="password">Password</label>
      <input id="password" type="password" v-model="user.password" placeholder="Password" required>
      <hr>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        email: '',
        password: '',
      },
    };
  },
  methods: {
    login() {
      const { email, password } = this.user;
      this.$store.dispatch('login', { email, password })
        .then(() => this.$router.push('/events'))
        .catch(err => console.log(err));
    },
  },
};
</script>
