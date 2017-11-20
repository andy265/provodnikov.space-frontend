const { createRenderer } = require('vue-server-renderer')
const { shallow } = require('vue-test-utils')
const AppIframe = require('~/components/AppIframe')

describe('AppIframe.vue', () => {
  it('has same HTML structure', () => {
    let wrapper = shallow(AppIframe, {
      propsData: {
        src: 'http://localhost:3000/some_page',
        height: 520,
        width: 300
      }
    })
    let renderer = createRenderer()
    // eslint-disable-next-line
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('has padding bottom', () => {
    let wrapper = shallow(AppIframe, {
      propsData: {
        src: '',
        height: 9,
        width: 16
      }
    })
    expect(wrapper.vm.paddingBottom).toEqual('56.25%')
  })

  it('and padding bottom <= 100%', () => {
    let wrapper = shallow(AppIframe, {
      propsData: {
        src: '',
        height: 10,
        width: 9
      }
    })
    expect(wrapper.vm.paddingBottom).toEqual('100%')
  })
})
