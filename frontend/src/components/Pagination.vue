<template>
  <div class="paginate">
    <p class="paginate__page-text">Page: </p>
    <div class="paginate__pages">
      <a href="#" class="paginate__link"
        v-if="hasFirst()"
        @click.prevent="changePage(1)"
      >
        1
      </a>
      <span v-if="hasFirst()">...</span>
      <a href="#" class="paginate__link"
        v-for="(page, index) in pages"
        :key="index"
        @click.prevent="changePage(page)"
        :class="{ 'paginate__link-current': current == page - 1 }"
      >
        {{ page }}
      </a>
      <span v-if="hasLast()">...</span>
      <a href="#" class="paginate__link"
        v-if="hasLast()"
        @click.prevent="changePage(totalPages)"
      >
        {{ totalPages }}
      </a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentPage: this.current,
    };
  },
  props: {
    current: {
      type: Number,
      default: 0,
    },
    total: Number,
    perPage: {
      type: Number,
      default: 9,
    },
    pageRange: {
      type: Number,
      default: 4,
    },
  },
  computed: {
    pages() {
      const pages = [];

      for (let i = this.rangeStart; i <= this.rangeEnd; i += 1) {
        pages.push(i);
      }

      return pages;
    },
    rangeStart() {
      const start = this.current - this.pageRange;

      return (start > 0) ? start : 1;
    },
    rangeEnd() {
      const end = this.current + this.pageRange;

      return (end < this.totalPages) ? end : this.totalPages;
    },
    totalPages() {
      return Math.ceil(this.total / this.perPage);
    },
  },
  methods: {
    hasFirst() {
      return this.rangeStart !== 1;
    },
    hasLast() {
      return this.rangeEnd < this.totalPages;
    },
    hasPrev() {
      return this.current > 1;
    },
    hasNext() {
      return this.current < this.totalPages;
    },
    changePage(page) {
      if (this.current === page - 1) {
        return false;
      }
      return this.$emit('page-changed', page - 1);
    },
  },
};
</script>

<style lang="sass">
@import '../utilities/variables.sass'

.paginate
  border: 1px solid $fontColor
  background-color: white
  color: $fontColor
  border-radius: 2px
  display: flex
  align-items: center
  padding: 0px 15px
  &__page-text
    margin-right: 10px
  &__link
    display: inline-block
    color: $fontColor
    text-decoration: none
    margin-right: 2px
    padding: 5px
    border: 1px solid transparent
    transition: all .5s
    &:hover
      color: $bkColor
      border: 1px solid $fontColor
      background-color: $fontColor
  &__link-current
    border: 1px solid $fontColor
</style>
