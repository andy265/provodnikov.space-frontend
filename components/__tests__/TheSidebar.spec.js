const Vuex = require('vuex')
const { createRenderer } = require('vue-server-renderer')
const { createLocalVue, shallow } = require('vue-test-utils')
const nextTick = require('~/script/nextTickPromise')
const app = require(`~/config/app.test.json`)
const TheSidebar = require('~/components/TheSidebar')

describe('TheSidebar.vue', () => {
  let localVue
  let store
  let mocks

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    store = new Vuex.Store({
      state: {
        page: {
          post: null, // or { id: 'some_id' }
          sidebar: {
            is: {
              addPostButton: false,
              editPostButton: false,
              editPostPanel: false,
              tags: false
            }
          }
        }
      }
    })
    mocks = {
      $router: {
        push: jest.fn()
      }
    }
    app.isCreateAndEditStatesAllowed = false
    global.StickySidebar = jest.fn()
  })

  function render () {
    let Component = Object.assign({}, TheSidebar, { components: {} })
    let wrapper = shallow(Component, {
      localVue,
      store
    })
    let renderer = createRenderer()
    // eslint-disable-next-line
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  }

  it('has [] on "post" page if (create and edit states denied)', () => {
    store.state.page.post = { id: 'some_id' }
    render()
  })

  it('has ["edit post button"] on "post" page (create and edit states allowed)', () => {
    app.isCreateAndEditStatesAllowed = true
    store.state.page.post = { id: 'some_id' }
    store.state.page.sidebar.is.editPostButton = true
    render()
  })

  it('has ["edit panel"] on "edit post" page (create and edit states allowed)', () => {
    app.isCreateAndEditStatesAllowed = true
    store.state.page.post = { id: 'some_id' }
    store.state.page.sidebar.is.editPostPanel = true
    render()
  })

  it('has ["edit panel"] on "create post" page (create and edit states allowed)', () => {
    app.isCreateAndEditStatesAllowed = true
    store.state.page.post = { id: 'some_id' }
    store.state.page.sidebar.is.editPostPanel = true
    render()
  })

  it('has ["tags"] on other pages (create and edit states denied)', () => {
    store.state.page.sidebar.is.tags = true
    render()
  })

  it('has ["add post button", "tags"] on other pages (create and edit states allowed)', () => {
    app.isCreateAndEditStatesAllowed = true
    store.state.page.sidebar.is.addPostButton = true
    store.state.page.sidebar.is.tags = true
    render()
  })

  it('has sticky sidebar', () => {
    // eslint-disable-next-line
    let wrapper = shallow(TheSidebar, {
      localVue,
      store
    })
    expect.assertions(1)
    return nextTick()
      .then(() => expect(global.StickySidebar.mock.calls).toHaveLength(1))
  })

  it('open add page on add post button click', () => {
    let wrapper = shallow(TheSidebar, {
      localVue,
      store,
      mocks
    })
    wrapper.vm.onCreatePostClick()
    expect(wrapper.vm.$router.push.mock.calls[0][0]).toBe('/create')
  })

  it('open edit page on edit post button click', () => {
    store.state.page.post = { id: 'some_id' }
    let wrapper = shallow(TheSidebar, {
      localVue,
      store,
      mocks
    })
    wrapper.vm.onEditPostClick()
    expect(wrapper.vm.$router.push.mock.calls[0][0]).toBe('/edit/some_id')
  })
})
