<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="register">
      <div>
        <label for="email">Email</label>
        <input id="email" type="email" v-model="user.email" required>
      </div>
      <div>
        <label for="password">Password</label>
        <input id="password" type="password" v-model="user.password" required>
      </div>
      <div>
        <label for="name">Name</label>
        <input id="name" type="text" v-model="user.name" required>
      </div>
      <div>
        <label for="city">City</label>
        <input id="city" type="text" v-model="user.city" required>
      </div>
      <div>
        <label for="phone"></label>
        <input id="phone" type="text" v-model="user.phone" required>
      </div>
      <div>
        <button type="submit">Register</button>
      </div>
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
        name: '',
        city: '',
        phone: '',
      },
    };
  },
  methods: {
    register() {
      const { user } = this;
      this.$store.dispatch('register', user)
        .then(() => this.$router.push('/'))
        .catch(err => console.log(err));
    },
  },
};
</script>
