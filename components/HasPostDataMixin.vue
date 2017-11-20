<script>
export default {
  props: {
    state: {
      type: String,
      required: true
    },

    isPreview: {
      type: Boolean,
      required: true
    },

    postId: {
      type: String,
      default: ''
    },

    postUrl: {
      type: String,
      required: true
    }
  }
}
</script>
