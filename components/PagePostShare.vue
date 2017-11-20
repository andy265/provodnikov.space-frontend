<template lang="pug">
  div.page-post-share
    AppButton(@click="onClick('vk')")
      AppIcon.app-icon_theme_button(type="vk")
    | ,
    |
    AppButton(@click="onClick('facebook')")
      AppIcon.app-icon_theme_button(type="facebook")
    |
    | или
    |
    AppButton(@click="onClick('twitter')")
      AppIcon.app-icon_theme_button(type="twitter")
    |
    | — лучший способ сказать мне "{{phrase}}".
    social-sharing(
      v-show="false"
      :url="postUrl"
      :title="title"
      :hashtags="hashtags"
      twitter-user="blogprovodnikov"
      inline-template
    )
      div
        network.page-post-share__link-vk(network="vk")
          span вконтакте
        network.page-post-share__link-facebook(network="facebook")
          span facebook
        network.page-post-share__link-twitter(network="twitter")
          span twitter
</template>

<script>
import AppButton from '~/components/AppButton'
import AppIcon from '~/components/AppIcon'

import _ from 'lodash'

export default {
  components: {
    AppButton,
    AppIcon
  },

  props: {
    postUrl: {
      type: String,
      required: true
    },

    title: {
      type: String,
      required: true
    },

    tags: {
      type: Array,
      required: true
    },

    postTagIds: {
      type: Array,
      required: true
    }
  },

  data () {
    let phrases = ['Мне нравится', 'Мне это по нраву', 'ГЖ', 'Годный пост', 'Неплохо, Андрюха!', 'Отлично, Андрюха!', 'Лойс', 'Пиши ещё!', 'Класс', 'Норм', 'Лайк', 'Молодец', 'Два чая', 'Плюс один']
    let phrase = phrases[Math.floor(phrases.length * Math.random())]

    return {
      phrase
    }
  },

  computed: {
    hashtags () {
      let names = {}
      this.tags.forEach(tag => { names[tag.id] = tag.name })
      return this.postTagIds.map(id => names[id]).join(',')
    }
  },

  methods: {
    onClick (name) {
      let link = this.$el.querySelector(`.page-post-share__link-${name}`)
      if (_.isElement(link)) {
        link.click()
      }
    }
  }
}
</script>

<style lang="sass">
.page-post-share
  color: $text-secondary
  font-family: $font-family-georgia
</style>
