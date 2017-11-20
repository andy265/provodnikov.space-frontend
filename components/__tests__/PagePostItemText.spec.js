const { shallow } = require('vue-test-utils')
const { createRenderer } = require('vue-server-renderer')
jest.mock('~/components/HasModelMixin', () => require('HasModelMixin'))
const PagePostItemText = require('~/components/PagePostItemText')

describe('PagePostItemText.vue', () => {
  let options
  let htmlChanges = {
    html: '<p>line 1</p><p>line 2</p><p></p>',
    text: 'line 1\nline 2\n'
  }

  beforeEach(() => {
    options = {
      propsData: {
        state: 'index',
        isPreview: false,
        postUrl: 'http://localhost/post/post_url',
        value: {
          html: '<p>some text</p>'
        }
      }
    }
  })

  it('has same HTML structure when state is "index"', () => {
    let Component = Object.assign({}, PagePostItemText, { components: {} })
    let wrapper = shallow(Component, options)
    let renderer = createRenderer()
    // eslint-disable-next-line
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('change text on html change', () => {
    let wrapper = shallow(PagePostItemText, options)
    wrapper.vm.onHtmlChange(htmlChanges)
    expect(wrapper.vm.model.text).toBe('line 1 line 2')
  })

  it('emit "input" event on html change', () => {
    let wrapper = shallow(PagePostItemText, options)
    wrapper.vm.onHtmlChange(htmlChanges)
    expect(wrapper.emitted().input[0][0]).toEqual({
      html: '<p>line 1</p><p>line 2</p><p></p>',
      text: 'line 1 line 2'
    })
  })
})
