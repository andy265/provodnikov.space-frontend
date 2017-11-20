<template lang="pug">
  modal.app-modal(
    :name="name"
    :click-to-close="clickToClose"
    :adaptive="true"
    :scrollable="true"
    :reset="true"
    width="640px"
    height="auto"
    @before-open="onBeforeOpen"
    @opened="onOpened"
    @closed="onClosed"
  )
    div.app-modal__content
      slot(name="content")
    div.app-modal__buttons
      slot(name="buttons")
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    },

    clickToClose: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    onBeforeOpen ({ params }) {
      this.$emit('before-open', params)
    },

    onOpened () {
      this.$emit('opened')
    },

    onClosed () {
      this.$emit('closed')
    }
  }
}
</script>

<style lang="sass">
.app-modal
  &.v--modal-overlay
    background: rgba($black, 0.9)
  &__content
    padding-bottom: $page-margin-x;
  &__buttons
    display: flex
    flex-direction: row
    > *
      flex-grow: 1
      margin: 0 1rem
    >:first-child
      margin-left: 0
    >:last-child
      margin-right: 0
  .v--modal
    padding: $content-padding-y $page-margin-x
    background: $bg-primary
    border-radius: 0
    box-shadow: 0 0 80px 30px $black
</style>
