const { createRenderer } = require('vue-server-renderer')
const { shallow } = require('vue-test-utils')
const TheFooter = require('~/components/TheFooter')

describe('TheFooter.vue', () => {
  it('has same HTML structure', () => {
    let Component = Object.assign({}, TheFooter, { components: {} })
    let wrapper = shallow(Component)
    let renderer = createRenderer()
    // eslint-disable-next-line
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })
})
