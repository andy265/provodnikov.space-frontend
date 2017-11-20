<template lang="pug">
  div.pages-edit
    PagePost(
      :value="post"
      :state="state"
      :is-preview="false"
      @save="save"
    )
    AppModal.pages-edit__modal-on-fail(name="pages-edit__modal-on-fail")
      template(slot="content")
        p Произошла ошибка при сохранении.
      template(slot="buttons")
        AppButton(@click="$modal.hide('pages-edit__modal-on-fail')") ну ок :(
    AppModal.pages-edit__modal-on-success(name="pages-edit__modal-on-success")
      template(slot="content")
        p Сохранено!
      template(slot="buttons")
        AppButton(@click="$modal.hide('pages-edit__modal-on-success')") продолжить редактирование
        AppButton(@click="onRouteToPostClick") перейти к посту
</template>

<script>
import AppButton from '~/components/AppButton'
import AppModal from '~/components/AppModal'
import PagePost from '~/components/PagePost.vue'

import _ from 'lodash'

export default {
  components: {
    AppButton,
    AppModal,
    PagePost
  },

  asyncData ({ store, params, error }) {
    return store.dispatch('posts/get', params.id)
      .then(post => {
        if (_.isEmpty(post)) {
          throw new Error('post is empty')
        }
        return { post: post }
      })
      .catch(() => error({ statusCode: 404 }))
  },

  data () {
    return {
      state: 'edit'
    }
  },

  created () {
    this.$store.commit('page/postOpened', { stateName: this.state, data: { id: this.post.id } })
    this.$store.commit('page/setSidebar', 'post-edit')
  },

  beforeDestroy () {
    this.$store.commit('page/postClosed')
  },

  methods: {
    onRouteToPostClick () {
      this.$modal.hide('pages-edit__modal-on-success')
      this.$router.push(`/post/${this.post.id}`)
    },

    save (changedPost) {
      this.$store.dispatch('posts/save', changedPost).then(() => {
        this.post = _.cloneDeep(changedPost)
        this.$store.commit('page/postUpdated', { is: { changed: false } })
        this.$modal.show('pages-edit__modal-on-success')
      }).catch(() => {
        this.$modal.show('pages-edit__modal-on-fail')
      })
    }
  },

  validate ({ params }) {
    return !_.isEmpty(params.id)
  },

  head () {
    return {
      title: `Редактирование "${this.post.name}"`
    }
  }
}
</script>
