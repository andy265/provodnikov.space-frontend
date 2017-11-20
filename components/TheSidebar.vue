<template lang="pug">
  div.the-sidebar
    div.the-sidebar__container 
      div.the-sidebar__inner
        template(v-if="isCreateAndEditStatesAllowed")
          AppButton.the-sidebar__item(
            v-if="$store.state.page.sidebar.is.addPostButton"
            @click="onCreatePostClick"
          ) + добавить пост
          AppButton.the-sidebar__item(
            v-if="$store.state.page.sidebar.is.editPostButton && $store.state.page.post"
            @click="onEditPostClick"
          ) редактировать пост
          TheSidebarPanelEdit.the-sidebar__item(v-if="$store.state.page.sidebar.is.editPostPanel")
        TheSidebarTags.the-sidebar__item(v-if="$store.state.page.sidebar.is.tags")
</template>

<script>
import AppButton from '~/components/AppButton'
import TheSidebarPanelEdit from '~/components/TheSidebarPanelEdit.vue'
import TheSidebarTags from '~/components/TheSidebarTags.vue'

import cssElementQueries from 'css-element-queries'
const app = require(`~/config/app.${process.env.NODE_ENV}.json`)

export default {
  components: {
    AppButton,
    TheSidebarPanelEdit,
    TheSidebarTags
  },

  computed: {
    isCreateAndEditStatesAllowed () {
      return app.isCreateAndEditStatesAllowed
    }
  },

  mounted () {
    this.$nextTick(() => {
      window.ResizeSensor = window.ResizeSensor || cssElementQueries.ResizeSensor
      // eslint-disable-next-line
      new window.StickySidebar('.the-sidebar__container', {
        topSpacing: 40,
        bottomSpacing: 40,
        innerWrapperSelector: '.the-sidebar__inner'
      })
    })
  },

  methods: {
    onCreatePostClick () {
      this.$router.push('/create')
    },

    onEditPostClick () {
      this.$router.push(`/edit/${this.$store.state.page.post.id}`)
    }
  }
}
</script>

<style lang="sass">
.the-sidebar
  margin-top: 5vh
  @include mobile
    margin-top: 0
  &__item
    margin-top: 1rem
  &__item:first-child
    margin-top: 0
</style>
