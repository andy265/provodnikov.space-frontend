<template lang="pug">
  div.page-post-panel
    div.page-post-panel__inner
      span {{componentTitle}}
      div.page-post-panel__buttons
        AppButton(
          :disabled="isFirstItem"
          @click="onUpClick"
        )
          AppIcon(
            :class="isFirstItem ? 'app-icon_theme_button-disabled' : 'app-icon_theme_button'"
            type="arrow-up"
          )
        AppButton(
          :disabled="isLastItem"
          @click="onDownClick"
        )
          AppIcon(
            :class="isLastItem ? 'app-icon_theme_button-disabled' : 'app-icon_theme_button'"
            type="arrow-down"
          )
        AppButton(@click="onRemoveClick")
          AppIcon.app-icon_theme_button(type="times")
</template>

<script>
import AppButton from '~/components/AppButton'
import AppIcon from '~/components/AppIcon'

export default {
  components: {
    AppButton,
    AppIcon
  },

  props: {
    content: {
      type: Array,
      required: true
    },

    item: {
      type: Object,
      required: true
    },

    index: {
      type: Number,
      required: true
    }
  },

  computed: {
    componentTitle () {
      switch (this.item.type) {
        case 'text':
          return 'Текст'
        case 'image':
          return 'Изображение'
        case 'iframe':
          return 'Видео'
        case 'poem':
          return 'Стих'
      }
      return ''
    },

    isFirstItem () {
      return this.index === 0
    },

    isLastItem () {
      return this.index === (this.content.length - 1)
    }
  },

  methods: {
    onUpClick () {
      this.$emit('up-click')
    },

    onDownClick () {
      this.$emit('down-click')
    },

    onRemoveClick () {
      this.$emit('remove-click')
    }
  }
}
</script>

<style lang="sass">
.page-post-panel__inner
  display: flex
  flex-direction: row
  padding-bottom: 0.6rem
.page-post-panel__buttons
  margin-left: auto
</style>
