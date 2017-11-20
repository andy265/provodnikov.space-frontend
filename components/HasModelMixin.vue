<script>
import _ from 'lodash'

export default {
  props: {
    value: {
      type: null,
      required: true
    }
  },

  data () {
    return {
      model: {}
    }
  },

  created () {
    if (!_.isEmpty(this.value)) {
      Object.assign(this.model, this.value)
    } else {
      this.$emit('init', this.model)
    }
    this.$nextTick(() => {
      this.$validator.validateAll()
      this.$_HasModelMixin_validated()
    })
  },

  methods: {
    onInput () {
      this.$emit('input', this.model)
      this.$_HasModelMixin_validated()
    },

    $_HasModelMixin_validated () {
      this.$nextTick(() => {
        this.$emit('validated', this.errors.count() === 0)
      })
    }
  }
}
</script>
