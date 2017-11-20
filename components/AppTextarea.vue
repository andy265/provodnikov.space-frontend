<template lang="pug">
  textarea.app-textarea(
    :value="value"
    @input="onInput"
  ) {{value}}
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true
    }
  },

  methods: {
    onInput ($event) {
      this.$emit('input', $event.target.value)
    }
  }
}
</script>

<style lang="sass">
.app-textarea
  overflow: hidden
  resize: none
  @include input
  &::placeholder
    @include placeholder
</style>
