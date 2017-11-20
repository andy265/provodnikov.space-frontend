<template lang="pug">
  div.page-pagination-item
    template(v-if="isLink")
      AppLink.app-link_color_primary(:to="to")
        slot
    template(v-else)
      slot
</template>

<script>
import AppLink from '~/components/AppLink'

export default {
  components: {
    AppLink
  },

  props: {
    isLink: {
      type: Boolean,
      required: true
    },

    to: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="sass">
.page-pagination-item
  font-family: $font-family-monospace
  font-size: ($font-size-base * 1.125)
  @include mobile
    font-size: $font-size-base
  color: $text-secondary
  cursor: default
  &_current
    font-weight: bold
</style>
