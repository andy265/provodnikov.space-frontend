const { createRenderer } = require('vue-server-renderer')
const { shallow } = require('vue-test-utils')
const AppIcon = require('~/components/AppIcon')

describe('AppIcon.vue', () => {
  it('has same HTML structure when size is not in props', () => {
    let wrapper = shallow(AppIcon, {
      propsData: {
        type: 'vk'
      }
    })
    let renderer = createRenderer()
    // eslint-disable-next-line
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('has same HTML structure when size is "2"', () => {
    let wrapper = shallow(AppIcon, {
      propsData: {
        type: 'vk',
        size: 4
      }
    })
    let renderer = createRenderer()
    // eslint-disable-next-line
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })
})
