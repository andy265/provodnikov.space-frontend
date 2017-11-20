<template lang="pug">
  button.app-button.ripple(@click="onClick")
    slot
</template>

<script>
export default {
  methods: {
    onClick ($event) {
      this.$emit('click', $event)
    }
  }
}
</script>

<style lang="sass">
.app-button
  background: $link-secondary
  color: $text-dark
  padding: 0.3em 1.2em
  text-align: center
  text-decoration: none
  display: inline-block
  font-family: $font-family-monospace
  font-size: $font-size-sm
  cursor: pointer
  border: none
  user-select: none
  &:focus
    outline: 0
  &:disabled
    background: darken($link-secondary, 26%)
    color: lighten($text-dark, 26%)
    cursor: not-allowed
  &:disabled:active:after
    opacity: 0
  &:hover:enabled
    background: $link-primary
  &_base
    font-size: $font-size-base
</style>
