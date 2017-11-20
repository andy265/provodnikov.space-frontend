const { createRenderer } = require('vue-server-renderer')
const { shallow } = require('vue-test-utils')
const AppList = require('~/components/AppList')

describe('AppList.vue', () => {
  it('has same HTML structure', () => {
    let wrapper = shallow(AppList, {
      slots: {
        default: '<div>item 1</div>'
      }
    })
    let renderer = createRenderer()
    // eslint-disable-next-line
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })
})
