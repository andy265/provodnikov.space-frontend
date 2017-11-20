const Vuex = require('vuex')
const { createRenderer } = require('vue-server-renderer')
const { createLocalVue, shallow } = require('vue-test-utils')
const TheSidebarTags = require('~/components/TheSidebarTags')

describe('TheSidebarTags.vue', () => {
  let localVue = createLocalVue()
  localVue.use(Vuex)

  let store = new Vuex.Store({
    state: {
      tags: {
        list: [
          { id: 'tag_1', name: 'tag name 1' },
          { id: 'tag_2', name: 'tag name 2' }
        ]
      }
    }
  })

  store.state.tags.list.toString = () => JSON.stringify(store.state.tags.list)

  it('has same HTML structure', () => {
    let Component = Object.assign({}, TheSidebarTags, { components: {} })
    let wrapper = shallow(Component, {
      localVue,
      store
    })
    let renderer = createRenderer()
    // eslint-disable-next-line
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })
})
