<template lang="pug">
  input.app-input(
    :value="value"
    type="text"
    @input="onInput"
  )
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      required: true
    }
  },

  methods: {
    onInput ({ target }) {
      this.$emit('input', target.value)
      this.$forceUpdate() // for v-modal.number
    }
  }
}
</script>

<style lang="sass">
.app-input
  @include input
  &::placeholder
    @include placeholder
</style>
