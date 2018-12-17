<template>
  <div class="wrapper">
    <h2>{{ title }}</h2>
    <div class="hashtags">
      <input class="hashtags__input" type="text" placeholder="Hashtag"
        v-model.trim="newHashtag"
        @keyup.enter="addHashtag"
      >
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
      <div class="event-list__event" v-for="event in matchedEvents" :key="event.id">
        <h2 class="event-list__title event-list_margin-5">{{ event.title }}</h2>
        <p class="event-list__par event-list_margin-5">{{ event.description }}</p>
        <p class="event-list__par event-list_margin-5">{{ event.city }}</p>
        <div class="event-list__dateBlock event-list_margin-5">
          <p class="event-list_margin-5">{{ event.startEvent | getDate}}</p>
          <p class="event-list_margin-5">{{ event.endEvent | getDate }}</p>
        </div>
        <div class="event-list__hashtags">
          <span class="event-list__hashtag"
            v-for="(hashtag, index) in event.hashtags"
            @click="addHashtag(hashtag)"
            :key="index"
          >
            {{ hashtag }}
          </span>
        </div>
      </div>
    </transition-group>
    <pagination
      :current="initialPage"
      :total="total"
      :perPage="limit"
      @page-changed="getEvents"
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
      events: [],
      hashtags: [],
      newHashtag: '',
      total: 0,
      limit: 10,
      initialPage: 0,
    };
  },
  components: {
    Pagination,
  },
  computed: {
    userEvents() {
      return this.$store.getters.userEvents;
    },
    matchedEvents() {
      if (this.hashtags.length === 0) {
        return this.events;
      }
      return this.events.filter(event => event.hashtags.some(this.checkHashtag));
    },
  },
  filters: {
    getDate(value) {
      const arr = value.split('T');
      return `${arr[0].split('-').join('.')} - ${arr[1].split('.').slice(0, -1)}`;
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
          },
        })
          .then((response) => {
            this.total = response.data.total;
            this.events = response.data.data;
          });
        return true;
      }
      this.total = this.userEvents.length;
      this.events = this.userEvents.slice(page * this.limit - 1, page * this.limit + this.limit);
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
  },
  created() {
    this.getEvents(this.initialPage);
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
  &__event
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
  &__hashtags
    margin-top: 15px
  &__hashtag
    @extend %hashtag
    margin: auto 10px auto 0px
    &:hover
      @extend %hover
  &_margin-5
    margin: 5px 0px 5px 0px

.hashtags
  display: flex
  flex-direction: column
  width: 100%
  &__input
    width: 50%
    padding: 5px
    color: $fontColor
    border: 1px solid $fontColor
    border-radius: 2px
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
