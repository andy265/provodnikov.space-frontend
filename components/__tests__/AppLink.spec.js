const { createRenderer } = require('vue-server-renderer')
const { shallow } = require('vue-test-utils')
const AppLink = require('~/components/AppLink')

describe('AppLink.vue', () => {
  it('has same HTML structure', () => {
    let wrapper = shallow(AppLink, {
      propsData: {
        to: '/page'
      },
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

  it('can open site in new tab', () => {
    let wrapper = shallow(AppLink, {
      propsData: {
        to: '/page',
        isBlank: true
      }
    })
    expect(wrapper.find('a').hasAttribute('target', '_blank')).toBeTruthy()
  })
})
