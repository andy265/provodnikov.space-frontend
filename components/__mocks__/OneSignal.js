import _ from 'lodash'

module.exports = class OneSignal {
  constructor ({ emit, isSupported, isEnabled, server }) {
    this.isSupported = isSupported || false
    this.isEnabled = isEnabled || false

    this.handlers = {}
    this.inputs = []

    this.process = data => {
      // some actions here
      // ...
      // ...
      // ...
      // and after
      if (_.isFunction(emit)) {
        // notificate aboute some actions with data
        emit(data)
      }
    }

    this.run = () => {
      if (!_.isEmpty(this.inputs)) {
        this.inputs.forEach(input => this.push(input))
        this.inputs = []
      }
    }

    if (!_.isUndefined(server)) {
      server.$on('server-event', ({ name, data }) => {
        if (_.isArray(this.handlers[name])) {
          this.handlers[name].forEach(handler => handler(data))
        }
      })

      server.$on('next-tick', () => {
        this.run()
      })
    }

    if (_.isArray(window.OneSignal) && !_.isEmpty(window.OneSignal)) {
      this.inputs = _.cloneDeep(window.OneSignal)
    }
  }

  push (input) {
    if (_.isFunction(input)) {
      input()
    } else if (_.isArray(input)) {
      this.process(input)
    }
  }

  isPushNotificationsSupported () {
    return this.isSupported
  }

  isPushNotificationsEnabled (callback) {
    callback(this.isEnabled)
  }

  on (eventName, handler) {
    if (_.isUndefined(this.handlers[eventName])) {
      this.handlers[eventName] = []
    }
    this.handlers[eventName].push(handler)
  }
}
