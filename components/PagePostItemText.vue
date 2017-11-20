<template lang="pug">
  div.page-post-item-text
    template(v-if="state === 'index'")
      div(v-html="model.html")
    template(v-else)
      AppHtmlEditor(
        :value="model.html"
        :toolbar="[['bold', 'italic', 'underline', 'strike'], ['code-block'], [{ list: 'ordered'}, { list: 'bullet' }], ['link']]"
        placeholder="Текст"
        name="text"
        v-validate="'required'"
        data-vv-as="Текст"
        @input="onHtmlChange"
      )
      AppTextError {{ errors.first('text') }}
    </template>
  </div>
</template>

<script>
import AppHtmlEditor from '~/components/AppHtmlEditor'
import AppTextError from '~/components/AppTextError'
import HasModelMixin from '~/components/HasModelMixin'
import HasPostDataMixin from '~/components/HasPostDataMixin'

export default {
  components: {
    AppHtmlEditor,
    AppTextError
  },

  mixins: [ HasModelMixin, HasPostDataMixin ],

  data () {
    return {
      model: {
        html: '',
        text: ''
      }
    }
  },

  methods: {
    onHtmlChange ({ html, text }) {
      this.model.html = html
      this.model.text = text.replace(/(?:\n)/g, ' ').trim()
      this.onInput()
    }
  }
}
</script>

<style lang="sass">
@import AppLink.sass
.page-post-item-text
  pre
    background: $pre-color
    padding: 0.5em
    white-space: pre-wrap
  ul
    li
      list-style-type: square
  a
    @extend .app-link
</style>
