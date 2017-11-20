const { createRenderer } = require('vue-server-renderer')
const { shallow } = require('vue-test-utils')
const AppTextarea = require('~/components/AppTextarea')

describe('AppTextarea.vue', () => {
  it('has same HTML structure', () => {
    let wrapper = shallow(AppTextarea, {
      propsData: {
        value: 'some text'
      }
    })
    let renderer = createRenderer()
    // eslint-disable-next-line
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('emit input event on change', () => {
    let wrapper = shallow(AppTextarea, {
      propsData: {
        value: 'some text'
      }
    })
    wrapper.find('textarea').element.value = 'new text'
    wrapper.find('textarea').trigger('input')
    expect(wrapper.emitted().input[0][0]).toBe('new text')
  })
})
