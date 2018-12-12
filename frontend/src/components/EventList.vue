<template>
  <div>
    <div class="event" v-for="event in events" :key="event.id">
      <h1>{{ event.title }}</h1>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      events: [],
      skip: 0,
      limit: 10,
    };
  },
  methods: {
    getEvents(skip, limit) {
      this.$http({
        url: this.$store.state.apiUrl + this.$store.state.api.findEvents.name,
        params: {
          $skip: skip,
          $limit: limit,
        },
      })
        .then((response) => {
          this.events = response.data.data;
        });
    },
  },
  created() {
    this.getEvents(this.skip, this.limit);
  },
};
</script>
