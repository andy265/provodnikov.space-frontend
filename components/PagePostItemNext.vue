<template lang="pug">
  div.page-post-item-next
    template(v-if="state === 'index' && isPreview")
      AppButton.app-button_base(@click="onNextClick")
        | дальше
        |
        AppIcon.app-icon_theme_button.app-icon_middle(type="long-arrow-right")
    template(v-if="state === 'index' && !isPreview")
      div.page-post-item-next__padding
    template(v-if="state !== 'index'")
      AppButton.app-button_base
        | дальше
        |
        AppIcon.app-icon_theme_button.app-icon_middle(type="long-arrow-right")
      AppTextError
</template>

<script>

import AppButton from '~/components/AppButton'
import AppIcon from '~/components/AppIcon'
import AppTextError from '~/components/AppTextError'
import HasModelMixin from '~/components/HasModelMixin'
import HasPostDataMixin from '~/components/HasPostDataMixin'

export default {
  components: {
    AppButton,
    AppIcon,
    AppTextError
  },

  mixins: [ HasModelMixin, HasPostDataMixin ],

  mounted () {
    if (this.state === 'index' && !this.isPreview && this.$route.hash === '#next') {
      this.$router.replace(this.$route.path)
      this.$scrollTo(this.$el, 1000)
    }
  },

  methods: {
    onNextClick () {
      window.location.href = `${this.postUrl}#next`
    }
  }
}
</script>

<style lang="sass">
.page-post-item-next__padding
  height: 0.5rem
</style>
