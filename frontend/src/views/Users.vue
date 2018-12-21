<template>
  <div class="users-block">
    <UserList type="all" title="All users" />
    <UserList type="user" title="My friends" />
  </div>
</template>

<script>
import UserList from '@/components/UserList.vue';

export default {
  data() {
    return {

    };
  },
  components: {
    UserList,
  },
};
</script>

<style lang="sass">
.users-block
  display: flex
  justify-content: space-around
</style>
