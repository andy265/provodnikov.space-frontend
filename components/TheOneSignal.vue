<template lang="pug">
  script(
    src="https://cdn.onesignal.com/sdks/OneSignalSDK.js"
    async
  )
</template>

<script>
import _ from 'lodash'

export default {
  mounted () {
    if (_.isUndefined(window.OneSignal)) {
      window.OneSignal = []
    }

    window.OneSignal.push(['init', {
      appId: '5bddfab0-3923-42b7-8ff2-98638b0a290d',
      autoRegister: false,
      welcomeNotification: {
        title: 'Андрей',
        message: '👍'
      }
    }])

    window.OneSignal.push(() => {
      if (window.OneSignal.isPushNotificationsSupported()) {
        window.OneSignal.on('notificationPermissionChange', ({ to }) => {
          let isCanSubscribe = to === 'default'
          this.$bus.$emit('is-can-subscribe-changed', isCanSubscribe)
        })
      }
    })
  }
}
</script>
