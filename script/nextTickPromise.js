import Vue from 'vue'

module.exports = () => {
  return new Promise(resolve => {
    Vue.nextTick(() => resolve())
  })
}
