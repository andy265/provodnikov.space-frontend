import Vue from 'vue'

if (process.browser) {
  const VueQuillEditor = require('vue-quill-editor/ssr')
  Vue.use(VueQuillEditor)

  const Quill = require('quill')
  const QuillLink = Quill.import('formats/link')

  class AppQuillLink extends QuillLink {
    static create (value) {
      let node = super.create(value)
      value = this.sanitize(value)
      node.setAttribute('href', value)
      node.setAttribute('rel', 'noopener noreferrer')
      if (value.startsWith('#')) {
        node.removeAttribute('target')
      }
      return node
    }
  }

  Quill.register(AppQuillLink, true)
}
