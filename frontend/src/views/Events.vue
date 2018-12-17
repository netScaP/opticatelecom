<template>
  <div class="events-block">
    <EventList type="all" title="All events" />
    <EventList type="user" title="My events" />
  </div>
</template>

<script>
import EventList from '@/components/EventList.vue';

export default {
  data() {
    return {

    };
  },
  components: {
    EventList,
  },
};
</script>

<style lang="sass">
.events-block
  display: flex
  justify-content: space-around
</style>
