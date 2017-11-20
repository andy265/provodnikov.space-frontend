<template lang="pug">
  AppModal.page-post-modal-image-flickr(
    name="page-post-modal-image-flickr"
    @opened="onOpened"
    @closed="onClosed"
  )
    template(slot="content")
      AppInput(
        v-model="imageEmbedData"
        v-validate="'required|page-post-modal-image-flickr__data'"
        name="imageEmbedData"
        type="text"
        placeholder="Flickr embed data изображения"
        data-vv-as="Flickr embed data изображения"
      )
      AppTextError {{ errors.first('imageEmbedData') }}
      AppInput(
        v-model="previewEmbedData"
        v-validate="'page-post-modal-image-flickr__data'"
        name="previewEmbedData"
        type="text"
        placeholder="Flickr embed data превью"
        data-vv-as="Flickr embed data превью"
      )
      AppTextError {{ errors.first('previewEmbedData') }}
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

import _ from 'lodash'

export default {
  components: {
    AppButton,
    AppInput,
    AppModal,
    AppTextError
  },

  data () {
    return {
      imageEmbedData: '',
      previewEmbedData: ''
    }
  },

  created () {
    this.$validator.extend('page-post-modal-image-flickr__data', {
      getMessage: field => `Поле ${field} содержит некорректные данные.`,
      validate: value => (_.isEmpty(value) || this.parseEmbedData(value).isValid)
    })
  },

  methods: {
    onCloseClick () {
      this.$modal.hide('page-post-modal-image-flickr')
    },

    onInitClick () {
      let value = {}
      let image = this.parseEmbedData(this.imageEmbedData)
      let preview = this.parseEmbedData(this.previewEmbedData)

      if (preview.isValid && preview.value.width > image.value.width && preview.value.height > image.value.height) {
        let copyPreview = preview
        preview = image
        image = copyPreview
      }

      Object.assign(value,
        image.value,
        (preview.isValid ? {
          previewSrc: preview.value.src,
          previewWidth: preview.value.width,
          previewHeight: preview.value.height
        } : {})
      )

      this.$emit('init', value)
      this.$modal.hide('page-post-modal-image-flickr')
    },

    onOpened () {
      this.$validator.validateAll()
    },

    onClosed () {
      this.imageEmbedData = ''
      this.previewEmbedData = ''
    },

    parseEmbedData (embedData) {
      let div = document.createElement('div')
      div.innerHTML = embedData
      let elements = div.childNodes

      let value = {
        src: '',
        width: 0,
        height: 0,
        href: '',
        alt: '',
        caption: ''
      }

      if (elements && elements.length) {
        let element = elements[0]

        if (element.href) {
          let path = 'https://www.flickr.com/photos/'
          if (element.href.substr(0, path.length) === path) {
            let params = element.href.slice(path.length).split('/')
            if (params.length >= 2 && params[0].length && params[1].length) {
              value.href = `${path}${params[0]}/${params[1]}/`
            }
          }
        }

        if (element.firstChild) {
          let child = element.firstChild

          if (child.src) {
            value.src = child.src
          }

          if (child.width) {
            value.width = child.width
          }

          if (child.height) {
            value.height = child.height
          }

          if (child.alt) {
            value.alt = child.alt
            value.caption = `<p>${child.alt}</p>`
          }
        }
      }

      let isValid = ['src', 'width', 'height', 'href'].every(key => value[key])

      return {
        isValid,
        value
      }
    }
  }
}
</script>
