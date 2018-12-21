<template>
  <form class="event" v-if="isCreate">
    <input type="text" class="event__title event__input event_margin-5"
      placeholder="Title"
      required
      v-model="event.title"
    >
    <textarea class="event__par event__input event_margin-5"
      placeholder="Description"
      required
      v-model="event.description"
    >
    </textarea>
    <input type="text" class="event__par event__input event_margin-5"
      placeholder="City"
      required
      v-model="event.city"
    >
    <div class="event__dateBlock">
      <span>Начало: </span>
      <input type="datetime-local" class="event__input event_margin-5"
        required
        v-model="event.startEvent"
      >
    </div>
    <div class="event__dateBlock">
      <span>Конец: </span>
      <input type="datetime-local" class="event__input event_margin-5"
        required
        v-model="event.endEvent"
      >
    </div>
    <div class="event__hashtags">
      <input type="text" class="event__hashtag event__hashtag-input"
        placeholder="Hashtag"
        v-for="(hashtag, index) in event.hashtags"
        v-model="event.hashtags[index]"
        :key="index"
      >
      <button class="event__button"
        @click.prevent="event.hashtags.push('')"
      >
        +
      </button>
    </div>
    <button class="event__button"
      @click.prevent="createEvent"
    >
      Add Event
    </button>
  </form>
  <div class="event" v-else>
    <h2 class="event__title event_margin-5">{{ event.title }}</h2>
    <p class="event__par event_margin-5">{{ event.description }}</p>
    <p class="event__par event_margin-5">{{ event.city }}</p>
    <div class="event__dateBlock event_margin-5">
      <p class="event_margin-5">{{ event.startEvent | getDate}}</p>
      <p class="event_margin-5">{{ event.endEvent | getDate }}</p>
    </div>
    <div class="event__hashtags">
      <span class="event__hashtag"
        v-for="(hashtag, index) in event.hashtags"
        @click="addHashtag(hashtag)"
        :key="index"
      >
        {{ hashtag }}
      </span>
    </div>
    <button class="user__button"
      v-if="type === 'all'"
      @click.prevent="followToEvent
    ">
      Follow to Event
    </button>
    <button class="user__button"
      v-else
      @click.prevent="exitFromEvent"
    >
      Exit from Event
    </button>
  </div>
</template>

<script>
export default {
  props: {
    event: {
      type: Object,
      default: () => ({
        title: '',
        description: '',
        city: '',
        startEvent: new Date().toISOString().substring(0, 16),
        endEvent: new Date().toISOString().substring(0, 16),
        hashtags: [''],
      }),
    },
    index: Number,
    isCreate: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'all',
    },
  },
  methods: {
    createEvent() {
      const { event } = this;
      for (let i = event.hashtags.length - 1; i >= 0; i -= 1) {
        if (event.hashtags[i] === '') {
          event.hashtags.splice(i, 1);
        }
      }
      if (event.hashtags.length === 0) {
        return this.$store.commit('flash_error', 'Add at least 1 hashtag');
      }
      const values = Object.values(event);
      for (let i = values.length - 1; i >= 0; i -= 1) {
        if (!values[i] || values[i] === '') {
          return this.$store.commit('flash_error', 'All fields are required');
        }
      }
      if (event.startEvent > event.endEvent) {
        return this.$store.commit('flash_error', 'StartEvent should be after of it end.');
      }
      return this.$store.dispatch('createEvent', event)
        .then(createdEvent => this.$emit('add-user-event', createdEvent))
        .catch(err => console.log(err));
    },
    followToEvent() {
      this.$emit('follow-to-event', this.event);
    },
    exitFromEvent() {
      this.$emit('exit-from-event', this.event);
    },
    addHashtag(hashtag) {
      return this.$emit('add-hashtag', hashtag);
    },
  },
  filters: {
    getDate(value) {
      const arr = value.split('T');
      return `${arr[0].split('-').join('.')} - ${arr[1].split('.').slice(0, -1)}`;
    },
  },
};
</script>

<style lang="sass">
@import '../utilities/variables.sass'
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

[contenteditable=true]:empty:before
  content: attr(placeholder)
  display: inline-block

.event
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
  &__input
    padding: 5px
    border-radius: 2px
    border: 1px solid $fontColor
    color: $fontColor
    &::placeholder
      color: $fontColor
  &__hashtags
    display: flex
    flex-wrap: wrap
    align-items: center
    margin-top: 15px
  &__hashtag
    @extend %hashtag
    margin-right: 10px
    margin-bottom: 10px
    &:hover
      @extend %hover
    &-input
      width: 80px
  &_margin-5
    margin: 5px 0px 5px 0px
</style>
