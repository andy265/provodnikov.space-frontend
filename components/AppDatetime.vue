<template lang="pug">
  time.app-datetime(:datetime="datetime") {{formatted}}
</template>

<script>
import moment from 'moment'

moment.locale('ru')

export default {
  props: {
    timestamp: {
      type: Number,
      required: true
    }
  },

  computed: {
    formatted () {
      return moment.unix(this.timestamp).format('D MMMM YYYY года, HH:mm')
    },

    datetime () {
      return moment.unix(this.timestamp).format('YYYY-MM-DD[T]HH:mm')
    }
  }
}
</script>

<style lang="sass">
.app-datetime
  font-family: $font-family-monospace
  color: $text-secondary
  font-size: $font-size-sm
  line-height: 1
</style>
