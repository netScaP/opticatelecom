<template>
  <div class="wrapper">
    <h2>{{ title }}</h2>
    <div class="hashtags">
      <div class="hashtags__form">
        <input class="hashtags__input" type="text" placeholder="Hashtag"
          v-model.trim="newHashtag"
          @keyup.enter="addHashtag"
        >
        <button class="hashtags__button"
          v-if="type !== 'all'"
          @click="isCreateEvent = !isCreateEvent"
        >
          {{ isCreateEvent ? 'Close' : 'Create Event' }}
        </button>
      </div>
      <transition-group name="hashtag-list" tag="div" class="hashtags__block">
        <span class="hashtags__hashtag"
          v-for="(hashtag, index) in hashtags"
          @click="deleteHashtag(index)"
          :key="hashtag"
        >
          {{ hashtag }}
        </span>
      </transition-group>
    </div>
    <transition-group name="event-list" tag="div" class="event-list" appear>
      <event
        v-if="isCreateEvent"
        :key="-1"
        @add-hashtag="addHashtag"
        :is-create="isCreateEvent"
        @add-user-event="addUserEvent"
      />
      <event
        v-for="event in events"
        :event="event"
        :key="event.id"
        @add-hashtag="addHashtag"
      />
    </transition-group>
    <pagination
      :current="currentPage"
      :total="total"
      :perPage="limit"
      @page-changed="getEvents"
    />
  </div>
</template>

<script>
import Event from './SingleEvent.vue';
import Pagination from './Pagination.vue';

export default {
  props: {
    type: String,
    title: String,
  },
  data() {
    return {
      events: [],
      isCreateEvent: false,
      hashtags: [],
      newHashtag: '',
      total: 0,
      limit: 2,
      currentPage: 0,
    };
  },
  components: {
    Event,
    Pagination,
  },
  computed: {
    userEvents() {
      return this.$store.getters.userEvents;
    },
    userFilteredEvents() {
      if (this.hashtags.length === 0) {
        return this.userEvents;
      }
      return this.userEvents.filter(event => event.hashtags.some(this.checkHashtag));
    },
  },
  methods: {
    getEvents(page) {
      if (this.type === 'all') {
        this.$http({
          url: this.$store.getters.getApiUrl + this.$store.getters.getApiMethods.findEvents.name,
          params: {
            $skip: page * this.limit,
            $limit: this.limit,
            hashtags: this.hashtags,
          },
        })
          .then((response) => {
            this.currentPage = page;
            this.total = response.data.total;
            this.events = response.data.data;
          });
        return true;
      }
      const sliceArguments = [page * this.limit - 1, page * this.limit + this.limit];

      this.currentPage = page;
      this.total = this.userFilteredEvents.length;
      this.events = this.userFilteredEvents.slice(...sliceArguments);
      return true;
    },
    addHashtag(hashtag) {
      if (this.newHashtag === '' && typeof hashtag !== 'string') {
        return false;
      }
      const newHashtag = typeof hashtag === 'string' ? hashtag : this.newHashtag;
      if (typeof hashtag !== 'string') {
        this.newHashtag = '';
      }
      if (this.hashtags.indexOf(newHashtag) === -1) {
        this.hashtags.push(newHashtag);
      }
      return this.getEvents(0);
    },
    deleteHashtag(index) {
      this.hashtags.splice(index, 1);
      this.getEvents(0);
    },
    checkHashtag(hashtag) {
      return this.hashtags.indexOf(hashtag) > -1;
    },
    addUserEvent(event) {
      this.isCreateEvent = false;
      this.events.unshift(event);
    },
  },
  created() {
    this.getEvents(this.currentPage);
  },
};
</script>

<style lang="sass">
@import '../utilities/variables.sass'

.hashtag-list
  &-item
    display: inline-block
    margin-right: 10px
  &-enter,
  &-leave-to
    opacity: 0
    transform: translateX(-30px)
  &-leave-active
    position: absolute

.event-list
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

.event-list
  display: flex
  flex-direction: column

.hashtags
  display: flex
  flex-direction: column
  width: 100%
  &__form
    display: flex
    justify-content: space-between
  &__input
    width: 50%
    padding: 5px
    color: $fontColor
    border: 1px solid $fontColor
    border-radius: 2px
  &__button
    @extend %hashtag
    background-color: $bkColor
  &__block
    min-height: 40px
    display: flex
    align-items: center
    flex-wrap: wrap
    width: 100%
  &__hashtag
    @extend %hashtag
    background-color: $bkColor
    margin: 5px 5px 5px 0px
    box-sizing: border-box
    &:hover
      @extend %hover
</style>
