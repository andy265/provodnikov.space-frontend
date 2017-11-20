<template lang="pug">
  AppList.app-list_normal
    PagePost(
      v-for="post in posts"
      :key="post.id"
      :value="post"
      :state="'index'"
      :is-preview="true"
    )
    PagePagination(
      v-if="pageCount > 1"
      :current="pageNumber"
      :count="pageCount"
      path="/page/"
      path-to-first-page="/"
    )
</template>

<script>
import AppList from '~/components/AppList'
import PagePost from '~/components/PagePost.vue'
import PagePagination from '~/components/PagePagination.vue'

import _ from 'lodash'
const app = require(`~/config/app.${process.env.NODE_ENV}.json`)

export default {
  components: {
    AppList,
    PagePost,
    PagePagination
  },

  asyncData ({ store, params, error }) {
    let values = _.defaults(params, { pageNumber: 1 })

    values.pageNumber = _.toNumber(values.pageNumber)

    if (!_.isFinite(values.pageNumber)) {
      error({ statusCode: 404 })
    }

    return store.dispatch('posts/getAll', ['id'])
      .then(posts => {
        if (_.isEmpty(posts)) {
          throw new Error('posts (getAll) is empty')
        }
        values.postCount = posts.length
      })
      .then(() => store.dispatch('posts/getList', values))
      .then(posts => {
        if (_.isEmpty(posts)) {
          throw new Error('posts (getList) is empty')
        }
        return {
          posts: posts,
          pageNumber: values.pageNumber,
          pageCount: Math.ceil(values.postCount / app.itemsPerPage)
        }
      })
      .catch(() => error({ statusCode: 404 }))
  },

  beforeCreate () {
    this.$store.commit('page/setSidebar', 'default')
  },

  head () {
    let title = `Андрей Проводников / Блог / Страница ${this.pageNumber}`
    let postList = `Посты: ${this.posts.map(post => `"${post.name}"`).join(', ')}`

    return {
      title: title,
      meta: [
        { hid: 'description', name: 'description', content: `${title} / ${postList}` }
      ]
    }
  }
}
</script>
