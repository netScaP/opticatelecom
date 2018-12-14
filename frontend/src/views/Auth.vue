<template>
  <div class="forms">
    <transition name="forms-transition" mode="out-in">
      <form class="auth-form"
        v-if="action === 'login'"
        @submit.prevent="login"
        key="login"
      >
        <input class="auth-form__input" type="email" placeholder="Email"
          v-model="user.email"
        />
        <input class="auth-form__input" type="password" placeholder="Password"
          v-model="user.password"
        />
        <button class="auth-form__button">login</button>
        <p class="auth-form__message">Not registered?
          <a class="auth-form__link" href="#" @click="action = 'register'">Create an account</a>
        </p>
      </form>
      <form class="auth-form"
        v-if="action === 'register'"
        @submit.prevent="register"
        key="register"
      >
        <input class="auth-form__input" type="email" placeholder="Email"
          v-model="user.email"
        />
        <input class="auth-form__input" type="password" placeholder="Password"
          v-model="user.password"
        />
        <input class="auth-form__input" type="text" placeholder="Name"
          v-model="user.name"
        />
        <input class="auth-form__input" type="text" placeholder="City"
          v-model="user.city"
        />
        <input class="auth-form__input" type="text" placeholder="Phone"
          v-model="user.phone"
        />
        <button class="auth-form__button">create</button>
        <p class="auth-form__message">Already registered?
          <a class="auth-form__link" href="#" @click="action = 'login'">Sign In</a>
        </p>
      </form>
    </transition>
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
      action: 'login',
    };
  },
  computed: {
    status() {
      return this.$store.getters.appStatus;
    },
  },
  methods: {
    login() {
      const { email, password } = this.user;
      this.$store.dispatch('login', { email, password })
        .then(() => this.$router.push({ name: 'events' }))
        .catch(err => console.log(err));
    },
    register() {
      this.$store.dispatch('register', this.user)
        .then(() => this.$router.push({ name: 'events' }))
        .catch(err => console.log(err));
    },
  },
};
</script>

<style lang="sass" scoped>

$transit: all .5s ease

.forms-transition
  &-enter-active,
  &-leave-active
    transition: $transit
  &-enter,
  &-leave-to
    opacity: 0
    max-width: 180px !important

.forms
  height: 100vh
  width: 100%
  display: flex
  justify-content: center
  align-items: center
.auth-form
  max-width: 360px
  background: #FFFFFF
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24)
  padding: 45px
  text-align: center
  transition: $transit
  &__input
    outline: 0
    background: #f2f2f2
    width: 100%
    border: 0
    margin: 0 0 15px
    padding: 15px
    box-sizing: border-box
    font-size: 14px
  &__button
    text-transform: uppercase
    outline: 0
    background: #4CAF50
    width: 100%
    border: 0
    padding: 15px
    color: #FFFFFF
    font-size: 14px
    transition: all .3s ease
    cursor: pointer
    &:hover,
    &:active,
    &:focus
      background: #43A047
  &__message
    margin: 15px 0 0
    color: #b3b3b3
    font-size: 12px
  &__link
    color: #4CAF50
    text-decoration: none
</style>
