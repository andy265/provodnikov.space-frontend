<template lang="pug">
  a.app-link(
    :href="to"
    :target="target"
    rel="noopener noreferrer"
  )
    slot
</template>

<script>
export default {
  props: {
    to: {
      type: String,
      required: true
    },

    isBlank: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    target () {
      return this.isBlank ? '_blank' : '_self'
    }
  }
}
</script>

<style lang="sass" src="~/components/AppLink.sass"></style>
