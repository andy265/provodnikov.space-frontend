const { createRenderer } = require('vue-server-renderer')
const { createLocalVue, shallow } = require('vue-test-utils')
const TheHeader = require('~/components/TheHeader')

describe('TheHeader.vue', () => {
  it('has same HTML structure', () => {
    let Component = Object.assign({}, TheHeader, { components: {} })
    let wrapper = shallow(Component)
    let renderer = createRenderer()
    // eslint-disable-next-line
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('open subscribe modal on subscribe click', () => {
    let wrapper = shallow(TheHeader, {
      localVue: createLocalVue(),
      mocks: {
        $router: {
          push: jest.fn()
        },
        $route: {
          path: '/page'
        }
      }
    })
    wrapper.vm.onSubscribeClick()
    expect(wrapper.vm.$router.push.mock.calls[0][0]).toEqual('/page#subscribe')
  })
})
