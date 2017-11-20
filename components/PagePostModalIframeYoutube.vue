<template lang="pug">
  AppModal.page-post-modal-iframe-youtube(
    name="page-post-modal-iframe-youtube"
    @opened="onOpened"
    @closed="onClosed"
  )
    template(slot="content")
      AppInput(
        v-model="iframeEmbedData"
        v-validate="'required|page-post-modal-iframe-youtube__data'"
        name="iframeEmbedData"
        placeholder="Youtube embed data"
        data-vv-as="Youtube embed data"
      )
      AppTextError {{ errors.first('iframeEmbedData') }}
    template(slot="buttons")
      AppButton(@click="onCloseClick") Отменить
      AppButton(
        :disabled="errors.count() > 0"
        @click="onInitClick"
      ) Создать
</template>

<script>
import AppButton from '~/components/AppButton'
import AppInput from '~/components/AppInput'
import AppModal from '~/components/AppModal'
import AppTextError from '~/components/AppTextError'

export default {
  components: {
    AppButton,
    AppInput,
    AppModal,
    AppTextError
  },

  data () {
    return {
      iframeEmbedData: ''
    }
  },

  created () {
    this.$validator.extend('page-post-modal-iframe-youtube__data', {
      getMessage: field => `Поле ${field} содержит некорректные данные.`,
      validate: value => this.parseEmbedData(value).isValid
    })
  },

  methods: {
    onCloseClick () {
      this.$modal.hide('page-post-modal-iframe-youtube')
    },

    onInitClick () {
      this.$emit('init', this.parseEmbedData(this.iframeEmbedData).value)
      this.$modal.hide('page-post-modal-iframe-youtube')
    },

    onOpened () {
      this.$validator.validateAll()
    },

    onClosed () {
      this.iframeEmbedData = ''
    },

    parseEmbedData (embedData) {
      let div = document.createElement('div')
      div.innerHTML = embedData
      let elements = div.firstChild

      let value = {
        id: '',
        width: 0,
        height: 0
      }

      if (elements) {
        if (elements.src && elements.src.lastIndexOf('/') !== -1) {
          value.id = elements.src.slice(elements.src.lastIndexOf('/') + 1)

          if (value.id.indexOf('?') !== -1) {
            value.id = value.id.slice(0, value.id.indexOf('?'))
          }
        }

        if (elements.width) {
          value.width = parseInt(elements.width)
        }

        if (elements.height) {
          value.height = parseInt(elements.height)
        }
      }

      let isValid = Object.keys(value).every(key => value[key])

      return {
        isValid,
        value
      }
    }
  }
}
</script>
