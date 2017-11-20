const { createRenderer } = require('vue-server-renderer')
const { shallow } = require('vue-test-utils')
const AppTitle = require('~/components/AppTitle')

describe('AppTitle.vue', () => {
  let tags = ['h1', 'h2', 'h3', 'span']
  let themes = ['text', 'sub', 'normal', 'main', '404']

  themes.forEach(theme => {
    it(`has same HTML structure with theme ${theme}`, () => {
      let wrapper = shallow(AppTitle, {
        propsData: {
          tag: 'span',
          theme: theme
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
  })

  it('can have link', () => {
    let wrapper = shallow(AppTitle, {
      propsData: {
        tag: 'span',
        to: '/page',
        theme: 'text'
      }
    })
    expect(wrapper.find('a').hasAttribute('href', '/page')).toBeTruthy()
  })

  tags.forEach(tag => {
    it(`can have tag ${tag}`, () => {
      let wrapper = shallow(AppTitle, {
        propsData: {
          tag: tag,
          theme: 'text'
        }
      })
      expect(wrapper.find(tag).element).toBeTruthy()
    })
  })
})
