<template lang="pug">
  span.app-icon.fa(
    :class="[typeClass, sizeClass]"
    aria-hidden="true"
  )
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true
    },

    size: {
      type: Number,
      default: 1,
      validator: value => [1, 2, 3, 4, 5].includes(value)
    }
  },

  computed: {
    typeClass () {
      return `fa-${this.type}`
    },

    sizeClass () {
      if (this.size === 1) {
        return ''
      }
      return `fa-${this.size}x`
    }
  }
}
</script>

<style lang="sass">
.app-icon
  &_middle
    vertical-align: middle
  &_transition-color
    transition: color $transition-time
  &_theme_button
    color: $bg-primary
  &_theme_button-disabled
    color: lighten($bg-primary, 26%)
  &_theme_scroll
    color: darken($link-secondary, 66.2%)
  &_theme_scroll-hover
    color: $link-secondary
</style>
