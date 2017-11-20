<template lang="pug">
  div.app-image
    div.app-image__inner
      img.app-image__image(
        :src="src"
        :alt="alt"
        @click="onClick"
        @error="onError"
      )
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    },

    alt: {
      type: String,
      required: true
    }
  },

  methods: {
    onClick ($event) {
      this.$emit('click', $event)
    },

    onError ($event) {
      this.$emit('error', $event)
    }
  }
}
</script>

<style lang="sass">
.app-image
  &__inner
    background: $bg-secondary
    width: fit-content
    margin: 0 auto
  &__image
    display: block
    object-fit: scale-down
    max-width: 100%
    max-height: 90vh
    height: auto
    user-select: none
  &_zoomable
    .app-image__image
      cursor: zoom-in
</style>
