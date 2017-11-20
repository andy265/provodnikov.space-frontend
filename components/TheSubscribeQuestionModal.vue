<template lang="pug">
  AppModal.the-subscribe-question-modal(name="the-subscribe-question-modal")
    template(slot="content")
      AppTitle.app-title_center(
        tag="span"
        theme="sub"
      ) Подписаться на Push-уведомления
      p
        | Привет, это Андрей!
        br
        br
        | Мой сайт показывает тебе это сообщение, потому что за последнее время ты посмотрел(а) несколько моих постов.
        br
        br
        strong Хочешь подписаться на Push-уведомления?
        br
        i.the-subscribe-question-modal__note После нажатия кнопки "да" нужно будет нажать "Разрешить".
    template(slot="buttons")
      AppButton(@click="onCloseClick") нет
      AppButton(@click="onSubscribeClick") да
</template>

<script>
import AppButton from '~/components/AppButton'
import AppLink from '~/components/AppLink'
import AppModal from '~/components/AppModal'
import AppTitle from '~/components/AppTitle'
import HasOneSignalMixin from '~/components/HasOneSignalMixin'

import _ from 'lodash'
import moment from 'moment'
const app = require(`~/config/app.${process.env.NODE_ENV}.json`)

export default {
  components: {
    AppButton,
    AppLink,
    AppModal,
    AppTitle
  },

  mixins: [HasOneSignalMixin],

  data () {
    return {
      storageKey: 'the-subscribe-question-modal',

      default: {
        showTimestamp: 0,
        posts: []
      },

      mountedTimestamp: 0
    }
  },

  mounted () {
    if (_.isObject(this.$store.state.page.post) && !_.isEmpty(this.$store.state.page.post.id)) {
      this.mountedTimestamp = moment().unix()
      this.$leaveHook.add(this.onLeave)

      this.ifCanShow()
        .then(() => {
          if (this.isLongPost()) {
            window.addEventListener('scroll', this.onScroll)
          } else {
            this.showModal()
          }
        })
        .catch(() => {})
    }
  },

  beforeDestroy () {
    this.$leaveHook.remove(this.onLeave)
    window.removeEventListener('scroll', this.onScroll)
  },

  methods: {
    onLeave () {
      if (moment().unix() - this.mountedTimestamp < 10) { // 10 sec
        return
      }

      let data = this.$storage.get(this.storageKey, this.default)
      let posts = _.cloneDeep(data.posts)

      let postId = this.$store.state.page.post.id
      let index = posts.findIndex(item => item.id === postId)
      if (index !== -1) {
        posts.splice(index, 1)
      }
      posts.unshift({ id: postId, timestamp: moment().unix() })
      posts = posts.slice(0, 10)

      data.posts = posts
      this.$storage.set(this.storageKey, data)
    },

    onScroll () {
      let isViewportScrolled = window.scrollY + 1.3 * window.innerHeight - document.body.clientHeight > 0
      if (isViewportScrolled) {
        let duration = moment().unix() - this.mountedTimestamp
        if (duration >= 10) { // 10 sec
          window.removeEventListener('scroll', this.onScroll)
          this.showModal()
        }
      }
    },

    onCloseClick () {
      this.$modal.hide('the-subscribe-question-modal')
    },

    onSubscribeClick () {
      this.$modal.hide('the-subscribe-question-modal')
      this.registerForPushNotifications()
    },

    showModal () {
      this.ifCanShow()
        .then(() => {
          let data = this.$storage.get(this.storageKey, this.default)
          data.showTimestamp = moment().unix()
          this.$storage.set(this.storageKey, data)
          this.$modal.show('the-subscribe-question-modal')
        })
        .catch(() => {})
    },

    ifCanShow () {
      return new Promise(resolve => {
        if (!app.isSubscribeQuestionAllowed) {
          throw new Error('subscribe question denied')
        }
        let { showTimestamp, posts } = this.$storage.get(this.storageKey, this.default)
        if (showTimestamp !== 0) {
          throw new Error('modal has been already shown')
        }
        if (posts.length <= 1) {
          throw new Error('too few views')
        }
        let index = posts.length - 1
        if (index > 2) {
          index = 2
        }
        if (this.mountedTimestamp - posts[index].timestamp > 20 * 24 * 60 * 60) { // 20 days
          throw new Error('previous post was viewed too long ago')
        }
        resolve()
      })
        .then(() => this.ifCanSubscribe())
    },

    isLongPost () {
      return window.innerHeight * 2 < document.body.clientHeight
    }
  }
}
</script>

<style lang="sass">
.the-subscribe-question-modal__note
  font-size: $font-size-sm
</style>
