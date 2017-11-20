<template lang="pug">
  AppDatetime(:timestamp="model.timestamp")
</template>

<script>
import AppDatetime from '~/components/AppDatetime'
import HasModelMixin from '~/components/HasModelMixin'

import moment from 'moment'

export default {
  components: {
    AppDatetime
  },

  mixins: [ HasModelMixin ],

  props: {
    state: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      model: {
        timestamp: this.getNow()
      },

      interval: undefined
    }
  },

  created () {
    if (this.state === 'create') {
      this.interval = setInterval(() => this.updateTimestamp(), 1000)
    }
  },

  beforeDestroy () {
    clearInterval(this.interval)
  },

  methods: {
    getNow () {
      return moment().seconds(0).unix()
    },

    updateTimestamp () {
      let now = this.getNow()
      if (this.model.timestamp !== now) {
        this.model.timestamp = now
        this.onInput()
      }
    }
  }
}
</script>
