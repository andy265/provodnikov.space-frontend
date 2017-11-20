const { createLocalVue, shallow } = require('vue-test-utils')
const Vuex = require('vuex')
const TheSidebarPanelEdit = require('~/components/TheSidebarPanelEdit')

describe('TheSidebarPanelEdit.vue', () => {
  let localVue
  let store

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    store = new Vuex.Store({
      state: {
        page: {
          post: {
            is: {
              next: false
            }
          }
        }
      }
    })
  })

  it('emit create-item event', () => {
    let wrapper = shallow(TheSidebarPanelEdit, {
      localVue: localVue,
      store: store,
      mocks: {
        $bus: {
          $emit: jest.fn()
        }
      }
    })
    wrapper.vm.onClick('some type')
    expect(wrapper.vm.$bus.$emit.mock.calls[0]).toEqual(['create-item', { type: 'some type' }])
  })

  it('disable button "create next" if item next exist', () => {
    store.state.page.post.is.next = true
    let wrapper = shallow(TheSidebarPanelEdit, {
      localVue,
      store
    })
    expect(wrapper.vm.isItemNextExist).toBe(true)
  })
})
