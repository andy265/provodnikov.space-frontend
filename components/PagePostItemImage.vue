<template lang="pug">
  div.page-post-item-image
    template(v-if="state === 'index'")
      AppImage.app-image_zoomable(
        v-if="!isLoadError"
        key="image-200"
        :src="msrc"
        :alt="model.alt"
        @click="onImageClick"
        @error="isLoadError = true"
      )
      AppImage(
        v-else
        key="image-404"
        src="/404.png"
        alt="404"
      )
      div.page-post-item-image__caption(v-html="model.caption")
    template(v-else)
      AppImage(
        :src="msrc"
        :alt="model.alt"
      )
      AppTextError
      AppInput(
        v-model="model.src"
        v-validate="'required|url'"
        name="src"
        placeholder="Ссылка на изображение"
        data-vv-as="Ссылка на изображение"
        @input="onInput"
      )
      AppTextError {{ errors.first('src') }}
      div.page-post-item-image__row
        AppInput.page-post-item-image__row-item(
          v-model.number="model.width"
          v-validate="'numeric'"
          name="width"
          placeholder="Ширина"
          data-vv-as="Ширина"
          @input="onInput"
        )
        AppInput.page-post-item-image__row-item(
          v-model.number="model.height"
          v-validate="'numeric'"
          name="height"
          placeholder="Высота"
          data-vv-as="Высота"
          @input="onInput"
        )
      div.page-post-item-image__row
        AppTextError.page-post-item-image__row-item {{ errors.first('width') }}
        AppTextError.page-post-item-image__row-item {{ errors.first('height') }}
      AppInput(
        v-model="model.href"
        v-validate="'url'"
        placeholder="Ссылка на страницу изображения"
        data-vv-as="Ссылка на страницу изображения"
        @input="onInput" name="href"
      )
      AppTextError {{ errors.first('href') }}
      AppInput(
        v-model="model.previewSrc"
        v-validate="'url'"
        name="previewSrc"
        placeholder="Ссылка на превью"
        data-vv-as="Ссылка на превью"
        @input="onInput"
      )
      AppTextError {{ errors.first('previewSrc') }}
      div.page-post-item-image__row
        AppInput.page-post-item-image__row-item(
          v-model.number="model.previewWidth"
          v-validate="'numeric'"
          name="previewWidth"
          placeholder="Ширина превью"
          data-vv-as="Ширина превью"
          @input="onInput"
        )
        AppInput.page-post-item-image__row-item(
          v-model.number="model.previewHeight"
          v-validate="'numeric'"
          name="previewHeight"
          placeholder="Высота превью"
          data-vv-as="Высота превью"
          @input="onInput"
        )
      div.page-post-item-image__row
        AppTextError.page-post-item-image__row-item {{ errors.first('previewWidth') }}
        AppTextError.page-post-item-image__row-item {{ errors.first('previewHeight') }}
      AppHtmlEditor(
        :value="model.caption"
        :toolbar="[['bold', 'italic', 'underline', 'strike'], ['link']]"
        placeholder="Описание"
        @input="onCaptionChange"
      )
      AppTextError
</template>

<script>

import AppHtmlEditor from '~/components/AppHtmlEditor'
import AppImage from '~/components/AppImage'
import AppInput from '~/components/AppInput'
import AppTextError from '~/components/AppTextError'
import HasModelMixin from '~/components/HasModelMixin'
import HasPathIdMixin from '~/components/HasPathIdMixin'
import HasPostDataMixin from '~/components/HasPostDataMixin'

import _ from 'lodash'

export default {
  components: {
    AppHtmlEditor,
    AppImage,
    AppInput,
    AppTextError
  },

  mixins: [ HasModelMixin, HasPathIdMixin, HasPostDataMixin ],

  data () {
    return {
      model: {
        src: '',
        alt: '',
        caption: '',
        width: '',
        height: '',
        href: '',
        previewSrc: '',
        previewWidth: '',
        previewHeight: ''
      },

      isLoadError: false
    }
  },

  computed: {
    msrc () {
      return _.isEmpty(this.model.previewSrc) ? this.model.src : this.model.previewSrc
    }
  },

  methods: {
    onCaptionChange ({ html, text }) {
      this.model.caption = html
      this.model.alt = text.replace(/(?:\n)/g, ' ').trim()
      this.onInput()
    },

    onImageClick ({ target }) {
      let { pathname } = new URL(this.model.src)
      this.$bus.$emit('image-zoom', {
        gid: this.postId,
        pid: this.toPathId(pathname),
        target: target,
        h: this.model.height,
        msrc: this.msrc,
        src: this.model.src,
        w: this.model.width
      })
    }
  }
}
</script>

<style lang="sass">
@import AppLink.sass
.page-post-item-image
  &__caption
    color: $text-secondary
    text-align: center
    font-family: $font-family-georgia
    font-size: $font-size-sm
    line-height: 1.2
    p
      margin: 0.5rem 0
    a
      @extend .app-link
  &__row
    display: flex
    flex-direction: row
  &__row-item:first-child
    margin-right: 1em
</style>
