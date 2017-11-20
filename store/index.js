export const state = () => ({
  serverInitError: false
})

export const mutations = {
  error (state) {
    state.serverInitError = true
  }
}

export const actions = {
  nuxtServerInit ({ commit }) {
    return this.dispatch('tags/load')
      .catch(() => commit('error'))
  }
}
