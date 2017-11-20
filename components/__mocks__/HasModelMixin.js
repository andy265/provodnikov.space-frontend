import _ from 'lodash'

module.exports = {
  props: {
    value: {
      type: null,
      required: true
    }
  },

  created () {
    if (!_.isEmpty(this.value)) {
      Object.assign(this.model, this.value)
    } else {
      this.$emit('init', this.model)
    }
  },

  methods: {
    onInput () {
      this.$emit('input', this.model)
    }
  }
}
