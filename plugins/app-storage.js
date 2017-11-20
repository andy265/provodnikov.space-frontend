import Vue from 'vue'

import _ from 'lodash'

Vue.prototype.$storage = {
  get: (key, defaultData) => {
    let data = {}

    try {
      data = JSON.parse(localStorage.getItem(key))
    } catch (e) {}

    if (_.isEmpty(data) || !_.isObject(data)) {
      data = {}
    }

    return _.defaults(data, defaultData)
  },

  set: (key, data) => {
    localStorage.setItem(key, JSON.stringify(data))
  }
}
