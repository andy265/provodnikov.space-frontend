<template lang="pug">
  div.pages-list
    AppTitle.pages-list__title.app-title_center(
      tag="h2"
      theme="normal"
    ) Список постов
    AppList.app-list_narrow
      div(
        v-for="post in posts"
        :key="post.id"
      )
        AppDatetime.pages-list__item-datetime(:timestamp="post.timestamp")
        AppTitle(
          :to="`/post/${post.id}`"
          tag="h3"
          theme="text"
        ) {{post.name}}
</template>

<script>
import AppDatetime from '~/components/AppDatetime.vue'
import AppList from '~/components/AppList'
import AppTitle from '~/components/AppTitle.vue'

const app = require(`~/config/app.${process.env.NODE_ENV}.json`)

export default {
  components: {
    AppDatetime,
    AppList,
    AppTitle
  },

  asyncData ({ store, params, error }) {
    return store.dispatch('posts/getAll', ['id', 'name', 'timestamp'])
      .then(posts => { return { posts: posts } })
      .catch(() => error({ statusCode: 404 }))
  },

  beforeCreate () {
    this.$store.commit('page/setSidebar', 'default')
  },

  head () {
    let title = 'Список постов'
    let postList = `Посты: ${this.posts.map(post => `"${post.name}"`).join(', ')}`
    let description = `${title} / ${postList}`
    if (description.length > app.descriptionMaxLength) {
      description = description.substr(0, app.descriptionMaxLength - 3) + '...'
    }

    return {
      title: title,
      meta: [
        { hid: 'description', name: 'description', content: description }
      ]
    }
  }
}
</script>

<style lang="sass">
.pages-list
  &__title
    margin-top: $page-title-margin-y
    margin-bottom: ($page-title-margin-y * 2)
  &__item-datetime
    margin-bottom: 0.5rem
</style>
