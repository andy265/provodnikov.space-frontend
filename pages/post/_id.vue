<template lang="pug">
  PagePost(
    :value="post"
    :state="state"
    :is-preview="false"
  )
</template>

<script>
import PagePost from '~/components/PagePost.vue'

import _ from 'lodash'

export default {
  components: {
    PagePost
  },

  asyncData ({ store, params, error }) {
    return store.dispatch('posts/get', params.id)
      .then(post => {
        if (_.isEmpty(post)) {
          throw new Error('post is empty')
        }
        return {
          post: post,
          state: 'index'
        }
      })
      .catch(() => error({ statusCode: 404 }))
  },

  created () {
    this.$store.commit('page/postOpened', { stateName: this.state, data: { id: this.post.id } })
    this.$store.commit('page/setSidebar', 'post-index')
  },

  beforeDestroy () {
    this.$store.commit('page/postClosed')
  },

  validate ({ params }) {
    return !_.isEmpty(params.id)
  },

  head () {
    return {
      title: this.post.name,
      meta: [
        { hid: 'description', name: 'description', content: this.post.description }
      ]
    }
  }
}
</script>
