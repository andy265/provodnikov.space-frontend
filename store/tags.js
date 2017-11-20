import axios from 'axios'
const app = require(`~/config/app.${process.env.NODE_ENV}.json`)

export const state = () => ({
  list: []
})

export const mutations = {
  set (state, list) {
    state.list = list
  }
}

export const actions = {
  load (state) {
    return axios.get(app.apiUrl + '/tags?_sort=name&_order=asc')
      .then(res => state.commit('set', res.data))
  },

  add (state, tag) {
    return axios.post(app.apiUrl + '/tags', tag)
      .then(() => state.dispatch('load'))
  }
}
