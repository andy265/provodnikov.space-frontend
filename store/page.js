import _ from 'lodash'

function createPost (stateName, { id }) {
  let props = {
    'index': {
      id: id,
      is: {
        next: false
      }
    },
    'edit': {
      id: id,
      is: {
        next: false
      }
    },
    'create': {
      is: {
        next: false
      }
    }
  }

  return props[stateName]
}

function createSidebar (stateName) {
  let enabledStateProps = {
    'default': {
      tags: true,
      addPostButton: true
    },
    'post-index': {
      editPostButton: true
    },
    'post-edit': {
      editPostPanel: true
    },
    'post-create': {
      editPostPanel: true
    }
  }

  return {
    is: Object.assign({
      tags: false,
      addPostButton: false,
      editPostButton: false,
      editPostPanel: false
    },
    enabledStateProps[stateName])
  }
}

export const state = () => ({
  sidebar: createSidebar('default'),
  post: null
})

export const mutations = {
  setSidebar (state, stateName) {
    state.sidebar = createSidebar(stateName)
  },

  postOpened (state, { stateName, data }) {
    state.post = createPost(stateName, data)
  },

  postClosed (state) {
    state.post = null
  },

  postUpdated (state, changes) {
    _.merge(state.post, changes)
  }
}
