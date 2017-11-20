const { createRenderer } = require('vue-server-renderer')
const { mount, shallow } = require('vue-test-utils')
const AppButton = require('~/components/AppButton')

describe('AppButton.vue', () => {
  it('has same HTML structure', () => {
    let wrapper = shallow(AppButton, {
      slots: {
        default: '<span>some button name</span>'
      }
    })
    let renderer = createRenderer()
    // eslint-disable-next-line
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('can be disabled', () => {
    let wrapper = mount({
      template: '<AppButton :disabled="true"/>',
      components: {
        AppButton
      }
    })
    expect(wrapper.find('button').element.getAttribute('disabled')).toBeTruthy()
  })

  it('emit click event', () => {
    let wrapper = shallow(AppButton)
    wrapper.trigger('click')
    expect(wrapper.emitted().click).toBeTruthy()
  })
})
