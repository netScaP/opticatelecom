<template>
  <div class="wrapper">
    <h2>{{ title }}</h2>
    <transition-group name="user-list" tag="div" class="user-list" appear>
      <div class="user"
        v-for="user in users"
        :key="user.id"
      >
        <h2 class="user__name user_margin-5">{{ user.name }}</h2>
        <p class="user__city user_margin-5">{{ user.city }}</p>
        <p class="user__phone user_margin-5">{{ user.phone }}</p>
        <button class="user__button"
          v-if="type === 'all'"
          @click.prevent="addFriend(user)
        ">
          Add to friends
        </button>
        <button class="user__button"
          v-else
          @click.prevent="deleteFriend(user)"
        >
          Delete from friends
        </button>
      </div>
    </transition-group>
    <pagination
      :current="currentPage"
      :total="total"
      :perPage="limit"
      @page-changed="getUsers"
    />
  </div>
</template>

<script>
import Pagination from './Pagination.vue';

export default {
  props: {
    type: String,
    title: String,
  },
  data() {
    return {
      users: [],
      total: 0,
      limit: 2,
      currentPage: 0,
    };
  },
  components: {
    Pagination,
  },
  computed: {
    userFriends() {
      return this.$store.getters.userFriends;
    },
  },
  watch: {
    userFriends() {
      this.getUsers(this.currentPage);
    },
  },
  methods: {
    getUsers(page) {
      if (this.type === 'all') {
        this.$http({
          url: this.$store.getters.getApiUrl + this.$store.state.api.findUsers.name,
          method: this.$store.state.api.findUsers.method,
          params: {
            $skip: page * this.limit,
            $limit: this.limit,
          },
        })
          .then((response) => {
            this.currentPage = page;
            this.total = response.data.total;
            this.users = response.data.data;
          });
        return true;
      }

      const sliceArguments = [page * this.limit, page * this.limit + this.limit];

      this.currentPage = page;
      this.total = this.userFriends.length;
      this.users = this.userFriends.slice(...sliceArguments);
      // if after delete friend page is empty
      if (this.users.length === 0) {
        this.currentPage -= 1;
        this.getUsers(this.currentPage);
      }
      return true;
    },
    addFriend(user) {
      this.$store.dispatch('addFriend', user)
        .then(friend => console.log(friend))
        .catch(err => console.log(err));
    },
    deleteFriend(friend) {
      this.$store.dispatch('deleteFriend', friend)
        .then(() => this.getUsers(this.currentPage))
        .catch(err => console.log(err));
    },
  },
  created() {
    this.getUsers(this.currentPage);
  },
};
</script>

<style lang="sass">
@import '../utilities/variables.sass'

.user-list
  &-enter,
  &-leave-to
    opacity: 0
    transform: translateY(100px)
  &-leave-active
    position: absolute
    width: 380px !important
  &-move
    transition: transform .8s

%hover
  border: 1px solid $bkColor
  background-color: $fontColor
  color: $bkColor
%hashtag
  padding: 5px 10px
  border-radius: 2px
  border: 1px solid $fontColor
  cursor: pointer
  transition: all .5s ease

.wrapper
  width: 380px
  padding-bottom: 40px

.user-list
  display: flex
  flex-direction: column

.user
  display: flex
  flex-direction: column
  text-align: left
  width: 100%
  padding: 15px
  margin-bottom: 30px
  border: 1px solid $fontColor
  background-color: $bkColor
  border-radius: 2px
  box-sizing: border-box
  transition: transform 1s, opacity .8s
  &__button
    @extend %hashtag
    background-color: $bkColor
    margin-right: 10px
    margin-bottom: 10px
    &:hover
      @extend %hover
  &_margin-5
    margin: 5px 0px 5px 0px
</style>
