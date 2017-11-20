const { createRenderer } = require('vue-server-renderer')
const { shallow } = require('vue-test-utils')
const The404 = require('~/components/The404')

describe('The404.vue', () => {
  it('has same HTML structure', () => {
    let Component = Object.assign({}, The404, { components: {} })
    let wrapper = shallow(Component)
    let renderer = createRenderer()
    // eslint-disable-next-line
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })
})
