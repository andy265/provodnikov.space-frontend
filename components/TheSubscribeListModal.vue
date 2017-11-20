<template lang="pug">
  AppModal.the-subscribe-list-modal(
    :click-to-close="true"
    name="the-subscribe-list-modal"
    @closed="onClosed"
    @opened="onOpened"
  )
    template(slot="content")
      AppTitle.app-title_center(
        tag="span"
        theme="sub"
      ) Подписаться
      div.the-subscribe-list-modal__body
        div(:style="contentStyleObject")
          p
            | Уведомления:
            |
            span(v-show="isCanSubscribeOnPush")
              AppLink(
                to="#"
                @click.native.prevent="onLinkPushClick"
              ) Push-уведомления
              | ,
              |
            AppLink(
              :is-blank="true"
              to="/rss.xml"
            ) RSS
            | .
          p
            | Каналы:
            |
            AppLink(
              :is-blank="true"
              to="https://twitter.com/blogprovodnikov"
            ) Twitter
            | ,
            |
            AppLink(
              :is-blank="true"
              to="https://t.me/provodnikov"
            ) Telegram
            | .
          p
            | Отдельные материалы:
            |
            AppLink(
              :is-blank="true"
              to="https://www.youtube.com/channel/UCRFe2sV1WpDg7-S9zUZ6lSA?sub_confirmation=1"
            ) Youtube
            | ,
            |
            AppLink(
              :is-blank="true"
              to="https://www.instagram.com/provodnikov.space/"
            ) Instagram
            | .
        div.the-subscribe-list-modal__spinner-container(v-if="!isLoaded")
          SimpleSpinner(
            size="large"
            line-fg-color="white"
            line-bg-color="#101010"
          )
    template(slot="buttons")
      AppButton(@click="onCloseClick") закрыть
</template>

<script>
import AppButton from '~/components/AppButton'
import AppLink from '~/components/AppLink'
import AppModal from '~/components/AppModal'
import AppTitle from '~/components/AppTitle'
import HasOneSignalMixin from '~/components/HasOneSignalMixin'

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
      isCanSubscribeOnPush: false,
      isLoaded: false,
      isOpened: false
    }
  },

  computed: {
    contentStyleObject () {
      return { 'visibility': (this.isLoaded ? 'visible' : 'hidden') }
    }
  },

  mounted () {
    this.$bus.$on('is-can-subscribe-changed', isCanSubscribe => {
      this.isCanSubscribeOnPush = isCanSubscribe
    })

    this.$router.afterEach(this.onAfterRoute)
    this.onAfterRoute()
  },

  beforeDestroy () {
    this.$bus.$off('is-can-subscribe-changed')
  },

  methods: {
    onAfterRoute () {
      if (this.$route.hash === '#subscribe' && !this.isOpened) {
        this.show()
      }
      if (this.$route.hash !== '#subscribe' && this.isOpened) {
        this.close()
      }
    },

    onCloseClick () {
      this.close()
    },

    onClosed () {
      this.isOpened = false

      if (this.$route.hash === '#subscribe') {
        let scrollY = window.scrollY
        this.$router.push(this.$route.path, () => {
          this.$nextTick(() => window.scrollTo(0, scrollY))
        })
      }
    },

    onOpened () {
      this.isOpened = true
    },

    onLinkPushClick () {
      this.registerForPushNotifications()
    },

    show () {
      this.isLoaded = false
      this.$modal.show('the-subscribe-list-modal')
      this.ifCanSubscribe()
        .then(() => { this.isCanSubscribeOnPush = true })
        .catch(() => { this.isCanSubscribeOnPush = false })
        .then(() => { this.isLoaded = true })
    },

    close () {
      this.$modal.hide('the-subscribe-list-modal')
    }
  }
}
</script>

<style lang="sass">
.the-subscribe-list-modal__body
  position: relative
.the-subscribe-list-modal__spinner-container
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  display: flex
  flex-direction: column
  justify-content: center
</style>
