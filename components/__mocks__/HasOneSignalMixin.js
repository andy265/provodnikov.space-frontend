let test = {
  defaultData () {
    return {
      registerForPushNotifications: {
        isCalled: false
      },
      ifCanSubscribe: {
        resolve: null,
        reject: null
      }
    }
  },

  data: {},

  create () {
    this.data = this.defaultData()
  }
}

module.exports = {
  test: test,
  methods: {
    registerForPushNotifications () {
      test.data.registerForPushNotifications.isCalled = true
    },

    ifCanSubscribe () {
      return new Promise((resolve, reject) => {
        test.data.ifCanSubscribe.resolve = resolve
        test.data.ifCanSubscribe.reject = reject
      })
    }
  }
}
