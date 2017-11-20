const { createRenderer } = require('vue-server-renderer')
const { shallow } = require('vue-test-utils')
const TheHeaderLogo = require('~/components/TheHeaderLogo')

describe('TheHeaderLogo.vue', () => {
  it('has same HTML structure', () => {
    let wrapper = shallow(TheHeaderLogo)
    let renderer = createRenderer()
    // eslint-disable-next-line
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })
})
