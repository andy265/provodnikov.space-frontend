<script>
import _ from 'lodash'

export default {
  methods: {
    ifCanSubscribe () {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('request time is out'))
        }, 5000)
        if (_.isUndefined(window)) {
          throw new Error('window is undefined')
        }
        if (_.isUndefined(window.OneSignal)) {
          throw new Error('OneSignal is undefined')
        }
        window.OneSignal.push(() => {
          if (!window.OneSignal.isPushNotificationsSupported()) {
            reject(new Error('push notifications doesn`t supported'))
          }
          window.OneSignal.isPushNotificationsEnabled(isEnabled => {
            if (isEnabled) {
              reject(new Error('push notifications is enabled'))
            }
            resolve(true)
          })
        })
      })
    },

    registerForPushNotifications () {
      if (!_.isUndefined(window) && !_.isUndefined(window.OneSignal)) {
        window.OneSignal.push(['registerForPushNotifications'])
      }
    }
  }
}
</script>
