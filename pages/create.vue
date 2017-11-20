<template lang="pug">
  div.pages-create
    PagePost(
      :value="post"
      :state="state"
      :is-preview="false"
      :posts="posts"
      @save="create"
    )
    AppModal.pages-create__modal-on-fail(name="pages-create__modal-on-fail")
      template(slot="content")
        p Произошла ошибка при сохранении.
      template(slot="buttons")
        AppButton(@click="$modal.hide('pages-create__modal-on-fail')") ну ок :(
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
    return store.dispatch('posts/getAll', ['id'])
      .then(posts => { return { posts: posts } })
      .catch(() => error({ statusCode: 404 }))
  },

  data () {
    return {
      post: {},
      state: 'create'
    }
  },

  created () {
    this.$store.commit('page/postOpened', { stateName: this.state, data: {} })
    this.$store.commit('page/setSidebar', 'post-create')
  },

  beforeDestroy () {
    this.$store.commit('page/postClosed')
  },

  methods: {
    create (post) {
      this.$store.dispatch('posts/add', post).then(() => {
        this.post = _.cloneDeep(post)
        this.$nextTick(() => {
          this.$store.commit('page/postClosed')
          this.$router.replace(`/post/${post.id}`)
        })
      }).catch(() => {
        this.$modal.show('pages-create__modal-on-fail')
      })
    }
  },

  head () {
    return {
      title: 'Создание нового поста'
    }
  }
}
</script>
