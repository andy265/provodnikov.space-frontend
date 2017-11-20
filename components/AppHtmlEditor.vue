<template lang="pug">
  div.app-html-editor.quill-editor(
    :content="content"
    v-quill:quillEditor=`{
      theme: 'bubble',
      placeholder: placeholder,
      modules: { toolbar },
      formats: formats
    }`
    @change="onChange"
  )
</template>

<script>
import _ from 'lodash'

export default {
  props: {
    value: {
      type: String,
      required: true
    },

    placeholder: {
      type: String,
      required: true
    },

    toolbar: {
      type: Array,
      required: true
    }
  },

  data () {
    return {
      isMounted: false
    }
  },

  computed: {
    content () {
      return this.isMounted ? this.value : '' // when it will be triggered, change event will be emitted by quill
    },

    formats () {
      return _.uniq(_.flatten(
        _.flatten(this.toolbar).map(item => {
          return _.isObject(item) ? _.keys(item) : item
        })
      ))
    }
  },

  mounted () {
    this.isMounted = true
  },

  methods: {
    onChange ({ html, text }) {
      if (_.isUndefined(html) || _.isUndefined(text)) {
        return
      }
      this.$emit('input', {
        html: html,
        text: text,
        toString: function () { return this.html }
      })
    }
  }
}
</script>

<style lang="sass">
.app-html-editor
  &.ql-container.ql-bubble:not(.ql-disabled)
    a
      color: $text-dark
    a:after
      display: none
    a:before
      transform: none
      border-radius: 0
      left: 0
      margin-left: 0
      top: 100%
  .ql-tooltip
    border-radius: 0
  .ql-editor
    @include input
    overflow: hidden
    &.ql-blank:before
      left: 4px
      right: 4px
      @include placeholder
</style>
