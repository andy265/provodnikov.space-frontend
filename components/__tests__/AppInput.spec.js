const { createRenderer } = require('vue-server-renderer')
const { mount, shallow } = require('vue-test-utils')
const AppInput = require('~/components/AppInput')

describe('AppInput.vue', () => {
  it('has same HTML structure', () => {
    let wrapper = mount({
      template: '<AppInput value="some text" placeholder="Text"/>',
      components: {
        AppInput
      }
    })
    let renderer = createRenderer()
    // eslint-disable-next-line
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('emit input event on change', () => {
    let wrapper = shallow(AppInput, {
      propsData: {
        value: 'some text'
      }
    })
    wrapper.find('input').element.value = 'new text'
    wrapper.find('input').trigger('input')
    expect(wrapper.emitted().input[0][0]).toEqual('new text')
  })
})
