import Vue from 'vue'

let hooks = []

function executeHooks () {
  let isStay = false

  hooks.forEach(hook => {
    let res = hook()
    if (res === true) {
      isStay = true
    }
  })

  return isStay
}

Vue.prototype.$leaveHook = {
  add: (hook) => {
    hooks.push(hook)
  },

  remove: (hook) => {
    let index = hooks.indexOf(hook)
    if (index !== -1) {
      hooks.splice(index, 1)
    }
  }
}

export default ({ app }) => {
  let message = 'Внесенные изменения не сохранятся.\nПокинуть эту страницу?'

  app.router.beforeEach((to, from, next) => {
    let isStay = executeHooks()
    if (isStay && !confirm(message)) {
      next(false)
    } else {
      next()
    }
  })

  window.onbeforeunload = $event => {
    let isStay = executeHooks()
    if (isStay) {
      $event.returnValue = message
      return message
    }
  }
}
