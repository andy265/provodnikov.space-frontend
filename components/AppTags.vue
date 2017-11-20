<template lang="pug">
  div.app-tags
    AppLink.app-tags__item(
      v-for="tag in tags"
      :key="tag.id"
      :to="`/tag/${tag.id}`"
    ) \#{{tag.name}}
</template>

<script>
import AppLink from '~/components/AppLink'

export default {
  components: {
    AppLink
  },

  props: {
    tags: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="sass">
.app-tags
  display: flex
  flex-wrap: wrap
  font-family: $font-family-monospace
  max-width: 100%
  &__item
    width: fit-content
    max-width: 100%
    margin-right: 0.5em
  &_direction_row
    flex-direction: row
  &_direction_column
    flex-direction: column
    @include mobile
      flex-direction: row
</style>
