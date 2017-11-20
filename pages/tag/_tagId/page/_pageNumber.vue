<template lang="pug">
  div.pages-tag
    AppTitle.pages-tag__title.app-title_center(
      tag="h2"
      theme="normal"
    ) Посты с тегом \#{{tag.name}}
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
        :path="`/tag/${tag.id}/page/`"
        :path-to-first-page="`/tag/${tag.id}`"
      )
</template>

<script>
import AppList from '~/components/AppList'
import AppTitle from '~/components/AppTitle'
import PagePost from '~/components/PagePost.vue'
import PagePagination from '~/components/PagePagination.vue'

import _ from 'lodash'
const app = require(`~/config/app.${process.env.NODE_ENV}.json`)

export default {
  components: {
    AppList,
    AppTitle,
    PagePost,
    PagePagination
  },

  asyncData ({ store, params, error }) {
    let values = _.defaults(params, { pageNumber: 1, tagId: '' })

    values.pageNumber = _.toNumber(values.pageNumber)

    if (!_.isFinite(values.pageNumber) || _.isEmpty(values.tagId)) {
      error({ statusCode: 404 })
    }

    return store.dispatch('posts/getAll', ['id', 'tags'])
      .then(posts => {
        let ids = posts.filter(post => post.tags.includes(values.tagId)).map(post => post.id)
        if (_.isEmpty(ids)) {
          throw new Error('ids is empty')
        }
        values.ids = ids
      })
      .then(() => store.dispatch('posts/getList', values))
      .then(posts => {
        if (_.isEmpty(posts)) {
          throw new Error('posts is empty')
        }
        return {
          tag: store.state.tags.list.find(tag => values.tagId === tag.id),
          posts: posts,
          pageNumber: values.pageNumber,
          pageCount: Math.ceil(values.ids.length / app.itemsPerPage)
        }
      })
      .catch(() => error({ statusCode: 404 }))
  },

  beforeCreate () {
    this.$store.commit('page/setSidebar', 'default')
  },

  head () {
    let title = `Посты с тегом #${this.tag.name} / Страница ${this.pageNumber}`
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

<style lang="sass">
.pages-tag__title
  margin: $page-title-margin-y 0
</style>
