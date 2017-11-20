const { shallow } = require('vue-test-utils')
const AppHtmlEditor = require('~/components/AppHtmlEditor')

describe('AppHtmlEditor.vue', () => {
  let propsData = {
    value: '<p>some text</p>',
    placeholder: 'Текст',
    toolbar: [['bold', 'italic'], ['code-block'], [{ list: 'ordered' }, { list: 'bullet' }]]
  }
  let changes = {
    html: '<p>new text</p>',
    text: 'new text'
  }

  it('can translate toolbar to formats', () => {
    let wrapper = shallow(AppHtmlEditor, {
      propsData
    })
    expect(wrapper.vm.formats).toEqual(['bold', 'italic', 'code-block', 'list'])
  })

  it('emit input event on change', () => {
    let wrapper = shallow(AppHtmlEditor, {
      propsData
    })
    wrapper.vm.onChange(changes)
    expect(wrapper.emitted().input).toBeTruthy()
  })

  it('and emmited object can cast to html string', () => {
    let wrapper = shallow(AppHtmlEditor, {
      propsData
    })
    wrapper.vm.onChange(changes)
    expect(wrapper.emitted().input[0][0].toString()).toEqual(changes.html)
  })
})
