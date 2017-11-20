const { createRenderer } = require('vue-server-renderer')
const { shallow } = require('vue-test-utils')
const AppTextError = require('~/components/AppTextError')

describe('AppTextError.vue', () => {
  it('has same HTML structure', () => {
    let wrapper = shallow(AppTextError, {
      slots: {
        default: '<span>some text</span>'
      }
    })
    let renderer = createRenderer()
    // eslint-disable-next-line
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })
})
