<template lang="pug">
  div.app-iframe
    div.app-iframe__inner(:style="styleObject")
      iframe.app-iframe__iframe(
        :src="src"
        allowfullscreen
      )
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    },

    height: {
      type: Number,
      required: true
    },

    width: {
      type: Number,
      required: true
    }
  },

  computed: {
    styleObject () {
      return { 'padding-bottom': this.paddingBottom }
    },

    paddingBottom () {
      let percent = 0
      if (this.height > 0 && this.width > 0) {
        percent = this.height / this.width * 100
        if (percent > 100) {
          percent = 100
        }
      }
      return percent + '%'
    }
  }
}
</script>

<style lang="sass">
.app-iframe
  &__inner
    float: none
    clear: both
    width: 100%
    position: relative
  &__iframe
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    border: none
    user-select: none
</style>
