<template lang="pug">
  nav.page-pagination
    PagePaginationItem.page-pagination__item(
      :is-link="isNot(first)"
      :to="pathTo(current - 1)"
    )
      AppIcon.app-icon_middle(type="long-arrow-left")
      |
      | назад
    PagePaginationItem.page-pagination__item(
      v-if="first !== pages[0]"
      :is-link="isNot(first)"
      :to="pathTo(first)"
    ) {{firstLabel}}
    PagePaginationItem.page-pagination__item(
      v-for="number in pages"
      :key="number"
      :is-link="isNot(number)"
      :to="pathTo(number)"
      :class="{ 'page-pagination-item_current': is(number) }"
    ) {{number}}
    PagePaginationItem.page-pagination__item(
      v-if="last !== pages[pages.length - 1]"
      :is-link="isNot(last)"
      :to="pathTo(last)"
    ) {{lastLabel}}
    PagePaginationItem.page-pagination__item(
      :is-link="isNot(last)"
      :to="pathTo(current + 1)"
    )
      | вперёд
      |
      AppIcon.app-icon_middle(type="long-arrow-right")
</template>

<script>

import AppIcon from '~/components/AppIcon'
import PagePaginationItem from '~/components/PagePaginationItem'

import _ from 'lodash'
const app = require(`~/config/app.${process.env.NODE_ENV}.json`)

export default {
  components: {
    AppIcon,
    PagePaginationItem
  },

  props: {
    current: {
      type: Number,
      required: true
    },

    count: {
      type: Number,
      required: true
    },

    path: {
      type: String,
      required: true
    },

    pathToFirstPage: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      maxPagesCount: app.paginationMaxItemsCount
    }
  },

  mounted () {
    if (_.isFunction(window.matchMedia)) {
      let mediaQuery = window.matchMedia(`(max-width: ${app.mobile.maxWidth}px)`)
      mediaQuery.addListener(this.updateMaxPagesCount)
      this.updateMaxPagesCount(mediaQuery)
    }
  },

  computed: {
    pages () {
      let pagesCount = this.count
      let ofsset = 0
      if (pagesCount > this.maxPagesCount) {
        ofsset = this.current - 1 - Math.floor(this.maxPagesCount / 2)
        if (ofsset < 0) {
          ofsset = 0
        }
        if (this.current === this.count) {
          ofsset = this.count - this.maxPagesCount
        }
        pagesCount = this.maxPagesCount
      }
      let start = ofsset + 1
      return _.range(start, start + pagesCount)
    },

    first () {
      return 1
    },

    last () {
      return this.count
    },

    firstLabel () {
      let isAddDots = this.first + 1 !== this.pages[0]
      return this.first + (isAddDots ? '..' : '')
    },

    lastLabel () {
      let isAddDots = this.last - 1 !== this.pages[this.pages.length - 1]
      return (isAddDots ? '..' : '') + this.last
    }
  },

  methods: {
    pathTo (number) {
      return number !== this.first ? `${this.path}${number}` : this.pathToFirstPage
    },

    is (number) {
      return number === this.current
    },

    isNot (number) {
      return !this.is(number)
    },

    updateMaxPagesCount (mediaQuery) {
      this.maxPagesCount = mediaQuery.matches ? app.mobile.paginationMaxItemsCount : app.paginationMaxItemsCount
    }
  }
}
</script>

<style lang="sass">
.page-pagination
  display: flex
  flex-direction: row
  justify-content: center
  flex-wrap: wrap
  &__item
    margin: 0 0.25em
  &__item:first-child
    margin-left: 0
    margin-right: 0.75em
  &__item:last-child
    margin-left: 0.75em
    margin-right: 0
</style>
