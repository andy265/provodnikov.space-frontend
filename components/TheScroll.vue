<template lang="pug">
  div.the-scroll(v-show="isShow")
    div.the-scroll__line(
        @click="onClick"
        @mouseover="isHover = true"
        @mouseleave="isHover = false"
      )
      div.the-scroll__inner
        AppIcon.app-icon_transition-color(
          :class="isHover ? 'app-icon_theme_scroll-hover' : 'app-icon_theme_scroll'"
          :size="2"
          :type="iconType"
        )
</template>

<script>

import AppIcon from '~/components/AppIcon'

export default {
  components: {
    AppIcon
  },

  data () {
    return {
      offset: 0,
      isShow: false,
      isHover: false
    }
  },

  computed: {
    iconType () {
      return this.offset === 0 ? 'angle-up' : 'angle-down'
    }
  },

  mounted () {
    window.addEventListener('scroll', this.onScroll)
  },

  beforeDestroy () {
    window.removeEventListener('scroll', this.onScroll)
  },

  methods: {
    onClick () {
      let previousOffset = this.offset
      this.offset = window.scrollY
      window.scrollTo(0, previousOffset)
    },

    onScroll () {
      let isViewportScrolled = window.scrollY - window.innerHeight / 2 > 0
      if (isViewportScrolled && this.offset !== 0) {
        this.offset = 0
      }
      this.isShow = isViewportScrolled || this.offset !== 0
    }
  }
}
</script>

<style lang="sass">
.the-scroll
  &__line
    width: 50px
    height: 100%
    transition: background $transition-time
    cursor: pointer
  &__line:hover
    background: lighten($bg-primary, 4%)
  &__inner
    position: sticky
    top: calc(100vh - 50px)
    display: flex
    justify-content: center
</style>
