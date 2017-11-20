<template lang="pug">
  div.the-sidebar-panel-edit
    AppButton.the-sidebar-panel-edit__item(@click="onClick('text')") + текст
    AppButton.the-sidebar-panel-edit__item(
      :disabled="isItemNextExist"
      @click="onClick('next')"
    ) + дальше
    AppButton.the-sidebar-panel-edit__item(@click="onClick('image')") + изображение
    AppButton.the-sidebar-panel-edit__item(@click="onClick('flickr')") + flickr
    AppButton.the-sidebar-panel-edit__item(@click="onClick('youtube')") + youtube
    AppButton.the-sidebar-panel-edit__item(@click="onClick('poem')") + стих
</template>

<script>
import AppButton from '~/components/AppButton'

import _ from 'lodash'

export default {
  components: {
    AppButton
  },

  computed: {
    isItemNextExist () {
      return _.isObject(this.$store.state.page.post) && this.$store.state.page.post.is.next
    }
  },

  methods: {
    onClick (type) {
      this.$bus.$emit('create-item', { type })
    }
  }
}
</script>

<style lang="sass">
.the-sidebar-panel-edit
  display: flex
  flex-direction: column
  &__item
    max-width: 200px
</style>
